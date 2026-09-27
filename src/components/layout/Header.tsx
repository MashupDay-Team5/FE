import backIcon from '@/assets/icons/back.svg';
import bookmarkIcon from '@/assets/icons/bookmark.svg';
import dropIcon from '@/assets/icons/drop.svg';
import searchIcon from '@/assets/icons/search.svg';

type MainHomeHeaderProps = {
  type: 'MainHome';
  schoolName: string;
  onTitleClick?: () => void;
  onSearchClick?: () => void;
  onBookmarkClick?: () => void;
};

type DetailSearchHeaderProps = {
  type: 'DetailSearch';
  categoryName: string;
  onBackClick?: () => void;
  onTitleClick?: () => void;
  onSearchClick?: () => void;
};

// 이후 Detail 타입은 이 유니온에 추가한다.
type HeaderProps = MainHomeHeaderProps | DetailSearchHeaderProps;

const HEADER_BASE_CLASS =
  'mx-auto h-[52px] w-full max-w-[480px] items-center text-text-primary';

type DropdownTitleProps = {
  name: string;
  onClick?: () => void;
};

// 이름(볼드) + 할인몰(일반 굵기) + 드롭다운 아이콘
function DropdownTitle({ name, onClick }: DropdownTitleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 items-center gap-gap-xs"
    >
      <span>
        <span className="typography-body-bold">{name}</span>
        <span className="typography-body-regular">할인몰</span>
      </span>
      <img src={dropIcon} alt="" width={16} height={16} />
    </button>
  );
}

function MainHomeHeader({
  schoolName,
  onTitleClick,
  onSearchClick,
  onBookmarkClick,
}: MainHomeHeaderProps) {
  return (
    <header
      className={`${HEADER_BASE_CLASS} flex justify-between bg-surface-brand px-padding-m`}
    >
      <DropdownTitle name={schoolName} onClick={onTitleClick} />

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

function DetailSearchHeader({
  categoryName,
  onBackClick,
  onTitleClick,
  onSearchClick,
}: DetailSearchHeaderProps) {
  return (
    // 좌우 영역을 1fr로 같게 두어 타이틀이 항상 가운데에 오도록 한다.
    <header
      className={`${HEADER_BASE_CLASS} grid grid-cols-[1fr_auto_1fr] bg-surface-default px-padding-xxs`}
    >
      <button
        type="button"
        onClick={onBackClick}
        aria-label="뒤로 가기"
        className="flex size-11 items-center justify-center justify-self-start"
      >
        <img src={backIcon} alt="" width={24} height={24} />
      </button>

      <DropdownTitle name={categoryName} onClick={onTitleClick} />

      <button
        type="button"
        onClick={onSearchClick}
        aria-label="검색"
        className="flex size-11 items-center justify-center justify-self-end"
      >
        <img src={searchIcon} alt="" width={24} height={24} />
      </button>
    </header>
  );
}

function Header(props: HeaderProps) {
  if (props.type === 'DetailSearch') {
    return <DetailSearchHeader {...props} />;
  }

  return <MainHomeHeader {...props} />;
}

export default Header;
