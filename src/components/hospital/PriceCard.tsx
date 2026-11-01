import { Link } from 'react-router-dom';

type PriceCardBaseProps = {
  width?: 'fill' | 'fixed' | 'flex';
  procedureName: string;
  originalPrice: string;
  originalPriceLabel?: string;
  className?: string;
  // ListCard 안에서 이 카드를 누르면 카드 기본 경로 대신 이 시술의 상세 경로로 이동한다.
  detailPath?: string;
};

type PriceCardProps =
  | (PriceCardBaseProps & {
      type: 'default';
      discountedPrice: string;
    })
  | (PriceCardBaseProps & {
      type: 'single';
      discountedPrice?: never;
    });

function PriceCard({
  type,
  width = 'fill',
  procedureName,
  originalPrice,
  discountedPrice,
  originalPriceLabel,
  className,
  detailPath,
}: PriceCardProps) {
  const cardHeightClassName = type === 'single' ? 'h-[84px]' : 'h-[120px]';
  const cardWidthClassName =
    width === 'fill'
      ? 'w-full'
      : width === 'flex'
        ? 'flex-[1_0_0]'
        : 'w-[220px] shrink-0';

  return (
    <article
      data-detail-path={detailPath}
      className={`flex ${cardHeightClassName} min-w-[220px] flex-col overflow-hidden rounded-[var(--radius-s)] border-[0.5px] border-border-brand ${cardWidthClassName} ${className ?? ''}`}
    >
      <div className="flex h-10 items-center justify-between bg-surface-brand-weak px-padding-s py-padding-xs">
        <h3 className="typography-body-medium text-text-primary">
          {/* 키보드·스크린리더에서도 시술별 상세로 이동할 수 있도록 시술명을 링크로 둔다. */}
          {detailPath ? (
            <Link
              to={detailPath}
              className="rounded-[var(--radius-s)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-brand"
            >
              {procedureName}
            </Link>
          ) : (
            procedureName
          )}
        </h3>
      </div>

      <div
        className={`flex flex-1 p-padding-s ${
          type !== 'single' ? 'flex-col gap-gap-s' : 'items-center'
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <span
            className={
              type === 'single'
                ? 'typography-label-small-regular font-medium text-text-secondary'
                : 'typography-label-small-medium text-text-tertiary'
            }
          >
            {originalPriceLabel ?? (type === 'single' ? '정상가격' : '정상가')}
          </span>
          <span
            className={
              type === 'single'
                ? 'typography-label-large-medium text-text-primary'
                : 'typography-label-small-regular text-text-tertiary'
            }
          >
            {originalPrice}
          </span>
        </div>
        {type !== 'single' && (
          <>
            <div className="border-t border-border-neutral" />
            <div className="flex items-center justify-between text-text-primary">
              <span className="typography-label-small-medium">
                대학생 할인가
              </span>
              <strong className="typography-label-large-medium">
                {discountedPrice}
              </strong>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export default PriceCard;
