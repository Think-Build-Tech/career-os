import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalStateService } from '../../services/portal-state.service';
import { BadgeTone, PageId } from '../../models/api.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly portal = inject(PortalStateService);

  isPageActive(pageId: PageId): boolean{
    return this.portal.activePage() === pageId;
  }

  isConversationActive(conversationId: string): boolean{
      return this.portal.activeConversationId() === conversationId;
  }

  getStatusDotColor(tone?: BadgeTone): string{
    const colorMap: Record<BadgeTone, string> = {
      good: 'bg-[#127a55]',
      acc: 'bg-[#a99cff]',
      bad: 'bg-[#f87171]',
      warn: 'bg-[#fbbf24]'
    }

    return tone ? colorMap[tone] : 'bg-[#8b91ad]';
  }
}
