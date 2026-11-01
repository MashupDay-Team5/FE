import { useHospitalBookmarks } from '@/hooks/useHospitalBookmarks';

type HospitalBookmarkButtonProps = {
  hospitalId: number;
  hospitalName: string;
  className?: string;
};

function HospitalBookmarkButton({
  hospitalId,
  hospitalName,
  className = '',
}: HospitalBookmarkButtonProps) {
  const { bookmarkedHospitalIds, toggleBookmark } = useHospitalBookmarks();
  const isBookmarked = bookmarkedHospitalIds.has(hospitalId);

  return (
    <button
      type="button"
      aria-label={`${hospitalName} 저장`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(hospitalId)}
      className={`flex size-11 shrink-0 items-center justify-center ${
        isBookmarked ? 'text-text-brand' : 'text-text-primary'
      } ${className}`}
    >
      <svg
        aria-hidden="true"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill={isBookmarked ? 'currentColor' : 'none'}
      >
        <path
          d="M21.6997 4.66675H6.29967C6.04194 4.66675 5.83301 4.87568 5.83301 5.13342V23.4854C5.83301 23.8841 6.30066 24.0992 6.60338 23.8398L13.696 17.7604C13.8707 17.6106 14.1286 17.6106 14.3034 17.7604L21.396 23.8398C21.6987 24.0992 22.1663 23.8841 22.1663 23.4854V5.13341C22.1663 4.87568 21.9574 4.66675 21.6997 4.66675Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export default HospitalBookmarkButton;
