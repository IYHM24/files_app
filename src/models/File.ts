export class FileModel {
  public id: string;
  public name: string;
  public originalName: string;
  public mimeType: string;
  public size: number;
  public path: string;
  public uploadedBy: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: Partial<FileModel>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.originalName = data.originalName || '';
    this.mimeType = data.mimeType || '';
    this.size = data.size || 0;
    this.path = data.path || '';
    this.uploadedBy = data.uploadedBy || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      originalName: this.originalName,
      mimeType: this.mimeType,
      size: this.size,
      path: this.path,
      uploadedBy: this.uploadedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromJSON(data: any): FileModel {
    return new FileModel({
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  public getFileExtension(): string {
    return this.originalName.split('.').pop() || '';
  }

  public getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}