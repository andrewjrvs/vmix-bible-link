import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan, faFloppyDisk, faPen } from '@fortawesome/free-solid-svg-icons';
import { Api } from '../../services/api';
import { VerseGroup } from '../../../electron/api';

interface EditableVerseGroup extends VerseGroup {
  editing: boolean;
  editTitle: string;
  editBody: string;
}

@Component({
  selector: 'jar-saved',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <h1>Saved Verse Groups</h1>

    @if (groups().length === 0) {
      <div class="empty-state">No saved verse groups yet. Select verses and click Save to create one.</div>
    }

    @for (group of groups(); track group.id) {
      <div class="group-card">
        @if (group.editing) {
          <div class="group-edit">
            <label>Title</label>
            <input class="beos-input" [(ngModel)]="group.editTitle" />
            <label>Body</label>
            <textarea class="beos-input body-textarea" [(ngModel)]="group.editBody"></textarea>
            <div class="group-actions">
              <button class="beos-btn save-btn" title="Save changes" (click)="saveGroup(group)">
                <fa-icon [icon]="faFloppyDisk" /> Save
              </button>
              <button class="beos-btn" title="Cancel" (click)="cancelEdit(group)">
                Cancel
              </button>
            </div>
          </div>
        } @else {
          <div class="group-header">
            <div>
              <span class="group-title">{{ group.title }}</span>
              <span class="group-date">{{ group.modifiedAt | date:'short' }}</span>
            </div>
            <div class="group-actions">
              <button class="beos-btn action-btn" title="Edit" (click)="startEdit(group)">
                <fa-icon [icon]="faPen" />
              </button>
              <button class="beos-btn action-btn delete-btn" title="Delete" (click)="deleteGroup(group)">
                <fa-icon [icon]="faTrashCan" />
              </button>
            </div>
          </div>
          <div class="group-body">{{ group.body }}</div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      padding: 20px;
      overflow-y: auto;
    }

    h1 {
      font-size: 1.2rem;
      margin: 0 0 16px 0;
      color: #222;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
      font-size: 0.95rem;
    }

    .group-card {
      background: #fff;
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      margin-bottom: 12px;
      padding: 12px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .group-title {
      font-weight: 600;
      font-size: 1rem;
      color: #333;
    }

    .group-date {
      font-size: 0.75rem;
      color: #888;
      margin-left: 10px;
    }

    .group-body {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #444;
      white-space: pre-wrap;
    }

    .group-actions {
      display: flex;
      gap: 6px;
    }

    .beos-btn {
      padding: 4px 10px;
      background: linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 100%);
      border: 2px solid;
      border-color: #ffffff #606060 #606060 #ffffff;
      color: #000;
      font-size: 0.85rem;
      cursor: pointer;
      font-weight: 500;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

      &:hover {
        background: linear-gradient(to bottom, #ff7b7b 0%, #ff6565 100%);
        color: white;
      }

      &:active {
        background: linear-gradient(to bottom, #c0c0c0 0%, #d8d8d8 100%);
        border-color: #606060 #ffffff #ffffff #606060;
        box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
      }
    }

    .action-btn {
      padding: 4px 8px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .save-btn {
      background: linear-gradient(to bottom, #6bc76b 0%, #4db84d 100%);
      color: white;
      border-color: #8fd98f #3a9a3a #3a9a3a #8fd98f;

      &:hover {
        background: linear-gradient(to bottom, #7bd77b 0%, #5dc85d 100%);
      }
    }

    .delete-btn {
      &:hover {
        background: linear-gradient(to bottom, #ff5555 0%, #dd3333 100%);
        color: white;
      }
    }

    .group-edit {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #555;
    }

    .beos-input {
      padding: 6px 8px;
      border: 2px solid;
      border-color: #606060 #ffffff #ffffff #606060;
      background: #fff;
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: #4a90e2 #a0c4f0 #a0c4f0 #4a90e2;
      }
    }

    .body-textarea {
      min-height: 100px;
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Saved {
  private api = inject(Api);

  protected faTrashCan = faTrashCan;
  protected faFloppyDisk = faFloppyDisk;
  protected faPen = faPen;

  protected groups = signal<EditableVerseGroup[]>([]);

  async ngOnInit() {
    const stored = await this.api.actions.getVerseGroups();
    this.groups.set(stored.map(g => ({
      ...g,
      editing: false,
      editTitle: g.title,
      editBody: g.body,
    })));
  }

  startEdit(group: EditableVerseGroup) {
    group.editing = true;
    group.editTitle = group.title;
    group.editBody = group.body;
    this.groups.set([...this.groups()]);
  }

  cancelEdit(group: EditableVerseGroup) {
    group.editing = false;
    this.groups.set([...this.groups()]);
  }

  async saveGroup(group: EditableVerseGroup) {
    const updated: VerseGroup = {
      id: group.id,
      title: group.editTitle,
      body: group.editBody,
      createdAt: group.createdAt,
      modifiedAt: group.modifiedAt,
    };

    const result = await this.api.actions.updateVerseGroup(updated);

    group.title = result.title;
    group.body = result.body;
    group.modifiedAt = result.modifiedAt;
    group.editing = false;
    this.groups.set([...this.groups()]);
  }

  async deleteGroup(group: EditableVerseGroup) {
    await this.api.actions.deleteVerseGroup(group.id);
    this.groups.set(this.groups().filter(g => g.id !== group.id));
  }
}
