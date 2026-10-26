import { useLayoutEffect, useRef, useState } from 'react';
import Badge from '@/components/common/Badge';

const MAX_KEYWORD_COUNT = 6;
// 2줄째 끝에 남은 공간이 이보다 좁으면 넘친 키워드를 말줄임으로 붙이지 않고 숨긴다.
const MIN_TRUNCATED_CHIP_WIDTH = 48;
// 말줄임 칩 최대 너비(Figma 기준 218px). 넓은 화면에서도 이 너비를 넘지 않는다.
const MAX_TRUNCATED_CHIP_WIDTH = 218;
const CHIP_GAP = 4;
const CHIP_LIST_CLASS = 'flex flex-wrap gap-x-gap-xs gap-y-gap-s';

const ELLIPSIS = '...';

type KeywordLayout = {
  visibleCount: number;
  // 2줄째 끝에 붙는 마지막 칩의 말줄임 문구. 칩 너비가 잘린 글자에 맞춰 줄어든다.
  truncatedLastKeyword?: string;
};

function KeywordChip({ keyword }: { keyword: string }) {
  return (
    <Badge size="L" color="keyword" shape="pill" className="max-w-full">
      <span className="min-w-0 truncate">{keyword}</span>
    </Badge>
  );
}

// 키워드 칩 목록: 최대 2줄. 3줄째로 넘어가는 첫 칩은 2줄째 남은 공간에 들어가는 글자까지만 남기고
// '...'을 붙여 이어 붙인다. 나머지 칩은 숨긴다.
function KeywordChipList({ keywords }: { keywords: string[] }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<KeywordLayout>({
    visibleCount: keywords.length,
  });

  useLayoutEffect(() => {
    const measure = measureRef.current;
    const probe = probeRef.current;
    if (!measure || !probe) return;

    // 잘린 글자를 넣었을 때의 칩 너비(패딩 포함)
    const getChipWidth = (text: string) => {
      const probeText = probe.querySelector(':scope > span > span');
      if (probeText) probeText.textContent = text;
      return probe.offsetWidth;
    };

    const updateLayout = () => {
      const chips = Array.from(measure.children) as HTMLElement[];
      const rowTops = [...new Set(chips.map((chip) => chip.offsetTop))];
      const overflowIndex = chips.findIndex(
        (chip) => rowTops.indexOf(chip.offsetTop) >= 2,
      );

      if (overflowIndex === -1) {
        setLayout({ visibleCount: chips.length });
        return;
      }

      const lastSecondRowChip = chips[overflowIndex - 1];
      const remainingWidth =
        measure.clientWidth -
        (lastSecondRowChip.offsetLeft + lastSecondRowChip.offsetWidth) -
        CHIP_GAP;
      const truncatedChipWidth = Math.min(
        remainingWidth,
        MAX_TRUNCATED_CHIP_WIDTH,
      );

      // 남은 공간에 '...'까지 들어가는 가장 긴 글자 수를 이진 탐색으로 찾는다.
      const characters = Array.from(keywords[overflowIndex]);
      const toTruncated = (length: number) =>
        characters.slice(0, length).join('').trimEnd() + ELLIPSIS;
      let low = 0;
      let high = characters.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (getChipWidth(toTruncated(middle)) <= truncatedChipWidth) {
          low = middle;
        } else {
          high = middle - 1;
        }
      }

      setLayout(
        low > 0 && remainingWidth >= MIN_TRUNCATED_CHIP_WIDTH
          ? {
              visibleCount: overflowIndex + 1,
              truncatedLastKeyword: toTruncated(low),
            }
          : { visibleCount: overflowIndex },
      );
    };
    updateLayout();

    // 웹폰트 로드나 화면 너비 변경으로 칩 너비가 바뀌면 다시 계산한다.
    let isActive = true;
    void document.fonts.ready.then(() => {
      if (isActive) updateLayout();
    });
    let lastWidth = measure.clientWidth;
    const observer = new ResizeObserver(() => {
      if (measure.clientWidth === lastWidth) return;
      lastWidth = measure.clientWidth;
      updateLayout();
    });
    observer.observe(measure);
    return () => {
      isActive = false;
      observer.disconnect();
    };
  }, [keywords]);

  const visibleKeywords = keywords.slice(0, layout.visibleCount);

  return (
    <div className="relative">
      <div className={CHIP_LIST_CLASS}>
        {visibleKeywords.map((keyword, index) => (
          <KeywordChip
            key={keyword}
            keyword={
              index === visibleKeywords.length - 1 &&
              layout.truncatedLastKeyword
                ? layout.truncatedLastKeyword
                : keyword
            }
          />
        ))}
      </div>

      {/* 계산용 보이지 않는 요소: 모든 칩의 위치를 재는 복제본과, 잘린 칩 너비를 재는 칩 하나 */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className={`invisible absolute inset-x-0 top-0 ${CHIP_LIST_CLASS}`}
      >
        {keywords.map((keyword) => (
          <KeywordChip key={keyword} keyword={keyword} />
        ))}
      </div>
      <span
        ref={probeRef}
        aria-hidden="true"
        className="invisible absolute top-0 left-0 inline-flex"
      >
        <KeywordChip keyword="" />
      </span>
    </div>
  );
}

// 블러 뒤 자리 표시용 칩 너비. 실제 키워드가 아니라 모양만 보여준다.
const PLACEHOLDER_CHIP_WIDTHS = [
  [140, 92, 76],
  [60, 116, 104],
];

// 리뷰 부족 시: 자리 표시 칩 위에 배경 흐림을 덮고 가운데 안내 문구를 보여준다.
function LockedKeywords() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="flex flex-col gap-gap-s">
        {PLACEHOLDER_CHIP_WIDTHS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-gap-xs">
            {row.map((width, chipIndex) => (
              <span
                key={chipIndex}
                className="h-8 rounded-full bg-surface-weak"
                style={{ width }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Figma blur 프레임(352×84)은 칩 영역보다 좌우 4.5px, 위아래 6px 크다. */}
      <div className="absolute -inset-x-[4.5px] -inset-y-1.5 flex items-center justify-center bg-white/[0.01] backdrop-blur-[8px]">
        <p className="rounded-[var(--radius-s)] border border-border-weak bg-surface-default px-padding-l py-padding-xs typography-label-small-regular text-text-secondary">
          리뷰가 10개 이상 모이면 키워드가 공개됩니다
        </p>
      </div>
    </div>
  );
}

type ReviewKeywordsProps = {
  keywords: string[];
  // 관련 리뷰가 부족해 키워드를 공개하지 않는 상태
  isLocked: boolean;
};

// 리뷰 키워드 영역: 관련 리뷰에서 추출한 키워드(최대 6개)와 AI 안내 문구.
function ReviewKeywords({ keywords, isLocked }: ReviewKeywordsProps) {
  if (isLocked) return <LockedKeywords />;
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-col gap-gap-m">
      <KeywordChipList keywords={keywords.slice(0, MAX_KEYWORD_COUNT)} />
      <p className="flex items-center gap-[5px] typography-caption-regular text-text-tertiary">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-text-tertiary"
        />
        영수증 리뷰에서 AI가 추출한 키워드입니다.
      </p>
    </div>
  );
}

export default ReviewKeywords;
