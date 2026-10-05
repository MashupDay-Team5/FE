type MallBannerProps = {
  imageUrl?: string;
  specialSaleLabel: string;
  onSpecialSaleClick?: () => void;
};

// 375×232 메인 배너와 특가전 배너 버튼. 이미지가 없으면 회색 placeholder를 보여준다.
function MallBanner({
  imageUrl,
  specialSaleLabel,
  onSpecialSaleClick,
}: MallBannerProps) {
  return (
    <section className="flex flex-col gap-gap-m">
      <div className="-mx-padding-m aspect-[375/232] bg-surface-weak">
        {imageUrl && (
          <img src={imageUrl} alt="" className="size-full object-cover" />
        )}
      </div>
      <button
        type="button"
        onClick={onSpecialSaleClick}
        className="flex h-[52px] w-full items-center justify-between rounded-[var(--radius-s)] bg-accent-background-orange px-padding-m py-padding-xxs"
      >
        <span className="typography-body-bold text-accent-foreground-orange">
          {specialSaleLabel}
        </span>
        <span className="typography-caption-regular text-text-tertiary">
          보러가기
        </span>
      </button>
    </section>
  );
}

export default MallBanner;
