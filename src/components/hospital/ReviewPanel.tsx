import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';
import dividerIcon from '@/assets/icons/divider.svg';
import heartIcon from '@/assets/icons/heart.svg';
import meatballIcon from '@/assets/icons/meatball.svg';
import pencilIcon from '@/assets/icons/pencil.svg';
import ratingStarIcon from '@/assets/icons/ratingStar.svg';
import Badge from '@/components/common/Badge';
import type {
  HospitalReview,
  HospitalReviewAuthor,
  HospitalReviewPayment,
} from '@/types/hospitalDetail';

// UserTypeBanner: 리뷰 작성자 유형 안내 띠. 현재는 일반 유저 문구만 있다.
function UserTypeBanner() {
  return (
    <p className="bg-surface-subtle py-padding-xxs text-center typography-caption-medium text-text-secondary">
      일반 모두닥 유저의 후기입니다.
    </p>
  );
}

// 인증 뱃지의 체크 아이콘은 글자색보다 연한 원래 색을 유지한다.
function CheckBadgeIcon() {
  return (
    <span
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center"
    >
      <img src={checkIcon} alt="" />
    </span>
  );
}

type PaymentBoxProps = {
  payments: HospitalReviewPayment[];
};

// 결제 금액 박스: 제목 아래 구분선, 항목 사이 구분선으로 결제 항목을 나열한다.
function PaymentBox({ payments }: PaymentBoxProps) {
  return (
    <div className="flex flex-col gap-gap-s rounded-[var(--radius-s)] bg-surface-weak px-padding-m py-padding-s">
      <div className="flex flex-col gap-[6px]">
        <p className="typography-label-small-regular leading-[18px] font-medium text-text-primary">
          결제 금액
        </p>
        {/* Figma에서 제목 구분선은 높이 0(테두리만)이라 1px을 겹쳐 묶음 높이 24를 맞춘다. */}
        <hr className="-mb-px border-border-neutral" />
      </div>

      <ul className="flex flex-col gap-gap-s">
        {payments.map((payment, index) => (
          <Fragment key={payment.treatmentName}>
            {index > 0 && (
              <li aria-hidden="true" className="px-padding-xs">
                <hr className="border-border-neutral" />
              </li>
            )}
            <li className="flex flex-col gap-gap-xs px-padding-xs">
              <div className="flex items-center justify-between gap-gap-s">
                <div className="flex min-w-0 items-center gap-gap-xs typography-label-small-regular leading-[18px] font-medium text-text-primary">
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{payment.treatmentName}</span>
                </div>
                <span className="shrink-0 typography-label-small-regular text-text-secondary">
                  {payment.price}
                </span>
              </div>
              {payment.description && (
                <p className="pl-padding-xs typography-caption-regular whitespace-pre-line text-text-secondary">
                  {payment.description}
                </p>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

type ReviewBodyProps = {
  body: string;
};

// 본문 최대 높이: body-regular 행간 24px × 3줄
const REVIEW_BODY_MAX_HEIGHT = 72;
const MORE_BUTTON_CLASS =
  'ml-padding-xs typography-label-small-regular font-medium text-text-secondary';

// 리뷰 본문: 최대 3줄까지 보여주고, 넘치면 글자 단위로 잘라 3줄째 끝에 ...더보기를 붙인다.
// 더보기를 누르면 같은 자리에서 본문 전체를 펼친다.
function ReviewBody({ body }: ReviewBodyProps) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const measureTextRef = useRef<HTMLSpanElement>(null);
  const [isExpanded, setExpanded] = useState(false);
  // null이면 3줄 안에 다 들어가 자를 필요가 없다.
  const [truncatedBody, setTruncatedBody] = useState<string | null>(null);

  useLayoutEffect(() => {
    const measure = measureRef.current;
    const measureText = measureTextRef.current;
    if (!measure || !measureText || isExpanded) return;

    const fits = (text: string, withMoreButton: boolean) => {
      measureText.textContent = text;
      measure.dataset.more = String(withMoreButton);
      return measure.scrollHeight <= REVIEW_BODY_MAX_HEIGHT;
    };

    // 더보기까지 3줄 안에 들어가는 가장 긴 글자 수를 이진 탐색으로 찾는다.
    const updateTruncation = () => {
      if (fits(body, false)) {
        setTruncatedBody(null);
        return;
      }

      const characters = Array.from(body);
      let low = 0;
      let high = characters.length;
      while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (fits(characters.slice(0, middle).join(''), true)) {
          low = middle;
        } else {
          high = middle - 1;
        }
      }
      setTruncatedBody(characters.slice(0, low).join('').trimEnd());
    };
    updateTruncation();
    // 웹폰트가 늦게 로드되면 글자 너비가 달라지므로 로드 후 한 번 더 계산한다.
    let isActive = true;
    void document.fonts.ready.then(() => {
      if (isActive) updateTruncation();
    });

    // 화면 너비가 바뀌면 줄바꿈 위치도 달라지므로 너비가 바뀔 때만 다시 계산한다.
    let lastWidth = measure.clientWidth;
    const observer = new ResizeObserver(() => {
      if (measure.clientWidth === lastWidth) return;
      lastWidth = measure.clientWidth;
      updateTruncation();
    });
    observer.observe(measure);
    return () => {
      isActive = false;
      observer.disconnect();
    };
  }, [body, isExpanded]);

  const isTruncated = !isExpanded && truncatedBody !== null;

  return (
    <div className="relative">
      <p className="typography-body-regular whitespace-pre-line text-text-primary">
        {isTruncated ? truncatedBody : body}
        {isTruncated && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={MORE_BUTTON_CLASS}
          >
            ...더보기
          </button>
        )}
      </p>

      {/* 글자 수 계산용 보이지 않는 복제본: 실제 본문과 같은 너비·글자 스타일로 높이를 잰다. */}
      {!isExpanded && (
        <p
          ref={measureRef}
          aria-hidden="true"
          className="group invisible absolute inset-x-0 top-0 typography-body-regular whitespace-pre-line"
        >
          <span ref={measureTextRef} />
          <span
            className={`hidden group-data-[more=true]:inline ${MORE_BUTTON_CLASS}`}
          >
            ...더보기
          </span>
        </p>
      )}
    </div>
  );
}

type MainAreaProps = {
  review: HospitalReview;
};

// MainArea: 인증 뱃지, 받은 진료, 평점, 결제 금액, 본문 영역. 뱃지 줄부터 순서대로 추가한다.
function MainArea({ review }: MainAreaProps) {
  const hasBadges = review.isReceiptVerified || review.isVisitedViaModoodoc;

  return (
    <div className="flex flex-col gap-gap-l p-padding-m">
      <div className="flex flex-col gap-gap-m">
        {hasBadges && (
          <div className="flex gap-[5px]">
            {review.isReceiptVerified && (
              <Badge
                size="S"
                color="sub"
                shape="square"
                icon={<CheckBadgeIcon />}
              >
                영수증 인증
              </Badge>
            )}
            {review.isVisitedViaModoodoc && (
              <Badge
                size="S"
                color="sub"
                shape="square"
                icon={<CheckBadgeIcon />}
              >
                모두닥으로 방문
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex min-w-0 flex-col gap-gap-xs">
            <p className="typography-body-bold text-text-strong">
              받은 진료: {review.treatmentNames.join(', ')}
            </p>
            <div className="flex items-center gap-[10px]">
              <span className="flex items-center">
                <img src={ratingStarIcon} alt="" width={16} height={16} />
                <span className="typography-label-small-regular leading-[18px] font-medium text-text-primary">
                  {review.rating.toFixed(1)}
                </span>
              </span>
              {review.willRevisit && (
                <>
                  <img src={dividerIcon} alt="" />
                  <span className="typography-label-small-regular text-text-secondary">
                    재방문 의사 있음
                  </span>
                </>
              )}
            </div>
            {review.doctorName && (
              <p className="typography-label-small-regular text-text-secondary">
                의사: {review.doctorName}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="리뷰 메뉴"
            className="flex size-6 shrink-0 items-center justify-center"
          >
            <img src={meatballIcon} alt="" />
          </button>
        </div>
      </div>

      {review.payments.length > 0 && <PaymentBox payments={review.payments} />}

      <ReviewBody body={review.body} />
    </div>
  );
}

type ProfileProps = {
  author: HospitalReviewAuthor;
  createdAt: string;
};

// 작성 정보의 아이콘 + 숫자 묶음 (작성한 리뷰 수, 받은 좋아요 수)
function ProfileStat({ icon, count }: { icon: string; count: number }) {
  return (
    <span className="flex items-center gap-0.5">
      <span
        aria-hidden="true"
        className="flex size-3 shrink-0 items-center justify-center"
      >
        <img src={icon} alt="" />
      </span>
      {count}
    </span>
  );
}

// Profile: 작성자 정보. 오른쪽 '도움이 돼요' ToggleButton은 별도 컴포넌트로 추가한다.
function Profile({ author, createdAt }: ProfileProps) {
  return (
    <div className="flex items-center justify-between px-padding-m">
      <div className="flex min-w-0 items-center gap-gap-s">
        <div className="size-8 shrink-0 overflow-hidden rounded-full border border-border-neutral bg-surface-weak">
          {author.profileImageUrl && (
            <img
              src={author.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="truncate typography-label-small-regular leading-[18px] font-medium text-text-secondary">
            {author.nickname}
          </p>
          <div className="flex items-center gap-gap-xs typography-caption-regular text-text-tertiary">
            <span className="sr-only">
              작성한 리뷰 {author.reviewCount}개, 받은 좋아요 {author.likeCount}
              개
            </span>
            <span aria-hidden="true" className="flex items-center gap-gap-xs">
              <ProfileStat icon={pencilIcon} count={author.reviewCount} />
              <ProfileStat icon={heartIcon} count={author.likeCount} />
            </span>
            <span
              aria-hidden="true"
              className="h-2.5 border-l border-border-weak"
            />
            <span className="whitespace-nowrap">{createdAt}리뷰 등록</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type ReviewPanelProps = {
  review: HospitalReview;
};

// ReviewPanel: 병원 상세 리뷰 탭에서만 쓰는 리뷰 카드.
// UserTypeBanner / MainArea / Profile / Callout 순서로 구성하며, 나머지 영역은 이어서 추가한다.
function ReviewPanel({ review }: ReviewPanelProps) {
  return (
    <article aria-label={`리뷰 ${review.reviewId}`}>
      <UserTypeBanner />
      <MainArea review={review} />
      <Profile author={review.author} createdAt={review.createdAt} />
    </article>
  );
}

export default ReviewPanel;
