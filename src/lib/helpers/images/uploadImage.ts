import { randomizeName } from '@/lib/utils';
import { supabase } from '@/server/supabase';
import { ImageFolderName } from '@/types/image';
import { createImageUrl } from './createImageUrl';

interface uploadImageProps {
  folderName: ImageFolderName;
  image: File;
  oldImageName: string | null;
}

export const uploadImage = async ({
  folderName,
  image,
  oldImageName,
}: uploadImageProps) => {
  try {
    if (oldImageName) {
      const { error: deleteError } = await supabase.storage
        .from(folderName)
        .remove([oldImageName]);
      if (deleteError) {
        return { imageName: '', imageUrl: '', error: deleteError };
      }
    }
    const randomName = randomizeName(image.name);
    const { error } = await supabase.storage
      .from(folderName)
      .upload(randomName, image);
    if (error) {
      return { imageName: '', imageUrl: '', error };
    }

    const imageUrl = createImageUrl({ folderName, imageName: randomName });
    return {
      imageName: randomName,
      imageUrl: imageUrl || undefined,
      error: null,
    };
  } catch (error) {
    return { imageUrl: '', error };
  }
};
