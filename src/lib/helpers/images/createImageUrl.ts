import { ImageFolderName } from '@/types/image';

interface createImageUrlProps {
  folderName: ImageFolderName;
  imageName: string | undefined;
}

export const createImageUrl = ({
  folderName,
  imageName,
}: createImageUrlProps) => {
  if (!imageName) {
    return null;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${folderName}/${imageName}`;
};
