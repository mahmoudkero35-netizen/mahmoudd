// إدارة تخزين Supabase
class SupabaseStorageManager {
    constructor() {
        this.supabase = window.supabaseClient;
        this.buckets = {
            images: 'cafe-images',
            documents: 'cafe-documents'
        };
    }
    
    async uploadImage(file, folder = 'menu-items') {
        try {
            const fileName = `${folder}/${Date.now()}_${file.name}`;
            
            const { data, error } = await this.supabase.storage
                .from(this.buckets.images)
                .upload(fileName, file);
            
            if (error) throw error;
            
            const { data: { publicUrl } } = this.supabase.storage
                .from(this.buckets.images)
                .getPublicUrl(fileName);
            
            return {
                success: true,
                fileName: fileName,
                publicUrl: publicUrl
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// إنشاء نسخة واحدة من المدير
const storageManager = new SupabaseStorageManager();
window.supabaseStorage = storageManager;
console.log('✅ Supabase Storage Manager initialized');
