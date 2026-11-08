export type PageId = 'home' | 'jobs' | 'apps' | 'grow' | 'people' | 'msgs' | 'more';

export type BadgeTone = 'good' | 'acc' | 'bad' | 'warn';

export type ChatGroupType = 'tacie' | 'alumni';

export interface NavigationItem { 
    id: PageId;
    label: string;
    iconId: string;
    badgeText?: string;
    badgeTone?: 'default' | 'warn';
}

export interface ChatMessage {
    sender: 'ai' | 'me';
    text: string;
}

export interface ChatThread{
    id: string;
    group: ChatGroupType;
    companyRole?: string;
    statusBadge?: {
        label: string;
        tone: BadgeTone;
    }
    contextDescription: string;
    creditsUsed?: number;
    isNewThread?: boolean;
    isTyping?: boolean;
    suggestedPrompts?: string[];
    messages: ChatMessage[];
}

export interface StudentProfileSummary {
  initials: string;
  fullName: string;
  branch: string;
  batchYear: number;
  cgpa: number;
  instituteCode: string;
  departmentLabel: string;
}

export interface DrawerConfig {
  type: string;
  payload?: unknown;
}