const fs = await import('fs/promises');
const path = await import('path');



export class StorageService {
    
    // guardar un archivo en el storage
    public static async saveFile(fileBytes: Buffer, filePath: string ): Promise<void> 
    {
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, fileBytes);
    }
}