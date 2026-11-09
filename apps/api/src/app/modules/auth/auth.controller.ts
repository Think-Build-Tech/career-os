import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { GlobalUser, PlatformAdmin, Tenant, TenantDatabase, TenantMembership } from '../control/models';
import { StudentProfile } from '../student/models/student.model';
import { User } from '../user/user.model';
import { hashPassword, issueToken, verifyPassword } from './auth.security';

function validCredentials(email: unknown, password: unknown): { email: string; password: string } | null {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || normalizedPassword.length < 12) return null;
  return { email: normalizedEmail, password: normalizedPassword };
}

async function hasUsablePlatformAdmin(): Promise<boolean> {
  const activeAdmins = await PlatformAdmin.findAll({
    where: { status: 'ACTIVE' },
    attributes: ['global_user_id'],
  });
  const userIds = activeAdmins.map((admin) => admin.global_user_id);
  if (!userIds.length) return false;
  return (await GlobalUser.count({
    where: {
      id: { [Op.in]: userIds },
      password_hash: { [Op.like]: 'scrypt$%' },
      status: 'ACTIVE',
    },
  })) > 0;
}

export async function bootstrapAdmin(req: Request, res: Response) {
  try {
    if (await hasUsablePlatformAdmin()) {
      return res.status(409).json({ success: false, message: 'A platform administrator already exists' });
    }
    const credentials = validCredentials(req.body?.email, req.body?.password);
    if (!credentials) {
      return res.status(400).json({ success: false, message: 'A valid email and password of at least 12 characters are required' });
    }
    const user = await GlobalUser.create({
      email: credentials.email,
      password_hash: hashPassword(credentials.password),
      status: 'ACTIVE',
    });
    const admin = await PlatformAdmin.create({ global_user_id: user.id, access_level: 'SUPER_ADMIN', status: 'ACTIVE' });
    const accessToken = issueToken({ sub: user.id, role: admin.access_level });
    return res.status(201).json({
      success: true,
      session: { accessToken, userId: user.id, userEmail: user.email, userName: user.email, roleCode: admin.access_level },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Unable to initialize administrator' });
  }
}

export async function loginAdmin(req: Request, res: Response) {
  try {
    const credentials = validCredentials(req.body?.email, req.body?.password);
    if (!credentials) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await GlobalUser.findOne({ where: { email: credentials.email } });
    if (!user || !verifyPassword(credentials.password, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const admin = await PlatformAdmin.findOne({ where: { global_user_id: user.id, status: 'ACTIVE' } });
    if (!admin) return res.status(403).json({ success: false, message: 'Platform administrator access is not active' });
    await user.update({ last_login_at: new Date(), status: 'ACTIVE' });
    const accessToken = issueToken({ sub: user.id, role: admin.access_level });
    return res.json({
      success: true,
      session: { accessToken, userId: user.id, userEmail: user.email, userName: user.email, roleCode: admin.access_level },
    });
  } catch (error: any) {
    const noAdmins = await hasUsablePlatformAdmin().then((usable) => !usable).catch(() => false);
    return res.status(noAdmins ? 409 : 500).json({
      success: false,
      code: noAdmins ? 'ADMIN_BOOTSTRAP_REQUIRED' : 'AUTHENTICATION_FAILED',
      message: noAdmins ? 'No platform administrator exists. Initialize the first administrator.' : (error?.message || 'Unable to authenticate'),
    });
  }
}

export async function loginStudent(req: Request, res: Response) {
  try {
    const credentials = validCredentials(req.body?.email, req.body?.password);
    const collegeCode = String(req.body?.college_code || '').trim();
    if (!credentials || !collegeCode) {
      return res.status(400).json({ success: false, message: 'College code, email, and password are required' });
    }
    const tenant = await Tenant.findOne({
      where: { [Op.or]: [{ college_code: collegeCode }, { slug: collegeCode.toLowerCase() }] },
      include: [{ model: TenantDatabase, as: 'database' }],
    });
    if (!tenant) return res.status(404).json({ success: false, message: 'Institution not found' });
    const globalUser = await GlobalUser.findOne({ where: { email: credentials.email } });
    if (!globalUser || !verifyPassword(credentials.password, globalUser.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const membership = await TenantMembership.findOne({
      where: { tenant_id: tenant.id, global_user_id: globalUser.id, status: 'ACTIVE' },
    });
    if (!membership) return res.status(403).json({ success: false, message: 'No active membership exists for this institution' });
    const localUser = await User.findOne({
      where: membership.local_user_id
        ? { [Op.or]: [{ id: membership.local_user_id }, { global_user_id: globalUser.id }] }
        : { global_user_id: globalUser.id },
    });
    if (!localUser) return res.status(409).json({ success: false, message: 'Student user profile is not linked to the membership' });
    const student = await StudentProfile.findOne({ where: { user_id: localUser.id } });
    if (!student) return res.status(403).json({ success: false, message: 'Student profile not found' });
    await globalUser.update({ last_login_at: new Date() });
    const database = (tenant as any).database as TenantDatabase | undefined;
    const accessToken = issueToken({ sub: globalUser.id, role: 'STUDENT', tenantId: tenant.id });
    return res.json({
      success: true,
      session: {
        accessToken,
        tenantId: tenant.id,
        userId: localUser.id,
        studentId: student.id,
        departmentId: student.department_id,
        collegeCode: tenant.college_code,
        institutionName: tenant.name,
        institutionSlug: tenant.slug,
        databaseName: database?.database_name,
        schemaVersion: database?.schema_version,
        databaseProvider: database?.provider,
        roleCode: 'STUDENT',
        userEmail: localUser.email,
        userName: localUser.fullName,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || 'Unable to authenticate' });
  }
}
