import { supabase } from '@/server/supabase';
import { ImageFolderName } from '@/types/image';

interface DeleteImageProps {
  folderName: ImageFolderName;
  imageName: string;
}

export const deleteImage = async ({
  folderName,
  imageName,
}: DeleteImageProps) => {
  const { error } = await supabase.storage.from(folderName).remove([imageName]);
  if (error) {
    return { error };
  }
  return { error: null };
};
