import bookmarkIcon from '@/assets/icons/bookmark.svg';
import dropIcon from '@/assets/icons/drop.svg';
import searchIcon from '@/assets/icons/search.svg';

// 이후 DetailSearch, Detail 타입은 이 유니온에 추가한다.
type HeaderProps = {
  type: 'MainHome';
  schoolName: string;
  onTitleClick?: () => void;
  onSearchClick?: () => void;
  onBookmarkClick?: () => void;
};

function Header({
  schoolName,
  onTitleClick,
  onSearchClick,
  onBookmarkClick,
}: HeaderProps) {
  return (
    <header className="flex h-[52px] mx-auto w-full max-w-[480px] items-center justify-between bg-surface-brand px-padding-m text-text-primary">
      <button
        type="button"
        onClick={onTitleClick}
        className="flex items-center gap-gap-xs"
      >
        <span>
          <span className="typography-body-bold">{schoolName}</span>
          <span className="typography-body-regular">할인몰</span>
        </span>
        <img src={dropIcon} alt="" width={16} height={16} />
      </button>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="검색"
          className="flex h-11 w-8 items-center justify-center"
        >
          <img src={searchIcon} alt="" width={24} height={24} />
        </button>
        <button type="button" onClick={onBookmarkClick} aria-label="저장">
          <img src={bookmarkIcon} alt="" width={32} height={44} />
        </button>
      </div>
    </header>
  );
}

export default Header;
