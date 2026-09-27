import backIcon from '@/assets/icons/back.svg';
import bookmarkIcon from '@/assets/icons/bookmark.svg';
import dropIcon from '@/assets/icons/drop.svg';
import homeIcon from '@/assets/icons/home.svg';
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

type DetailHeaderProps = {
  type: 'Detail';
  title: string;
  onBackClick?: () => void;
  onHomeClick?: () => void;
};

type HeaderProps =
  MainHomeHeaderProps | DetailSearchHeaderProps | DetailHeaderProps;

const HEADER_BASE_CLASS =
  'mx-auto h-[52px] w-full max-w-[480px] items-center text-text-primary';

type IconButtonProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

// Figma IconButton/Default: 44×44 버튼 안에 24px 아이콘
function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center"
    >
      <img src={icon} alt="" width={24} height={24} />
    </button>
  );
}

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
      <div className="justify-self-start">
        <IconButton icon={backIcon} label="뒤로 가기" onClick={onBackClick} />
      </div>

      <DropdownTitle name={categoryName} onClick={onTitleClick} />

      <div className="justify-self-end">
        <IconButton icon={searchIcon} label="검색" onClick={onSearchClick} />
      </div>
    </header>
  );
}

function DetailHeader({ title, onBackClick, onHomeClick }: DetailHeaderProps) {
  return (
    // 오른쪽 영역은 비어 있지만 1fr 칸을 유지해 타이틀을 가운데에 둔다.
    <header
      className={`${HEADER_BASE_CLASS} grid grid-cols-[1fr_auto_1fr] bg-surface-default px-padding-xxs`}
    >
      <div className="flex justify-self-start">
        <IconButton icon={backIcon} label="뒤로 가기" onClick={onBackClick} />
        <IconButton icon={homeIcon} label="홈" onClick={onHomeClick} />
      </div>

      <h1 className="typography-body-bold">{title}</h1>
    </header>
  );
}

function Header(props: HeaderProps) {
  if (props.type === 'DetailSearch') {
    return <DetailSearchHeader {...props} />;
  }

  if (props.type === 'Detail') {
    return <DetailHeader {...props} />;
  }

  return <MainHomeHeader {...props} />;
}

export default Header;
