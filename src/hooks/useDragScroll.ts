import {
  useRef,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

// 이만큼 이상 움직이면 클릭이 아니라 드래그로 본다.
const DRAG_THRESHOLD = 8;

type DragState = {
  startX: number;
  startScrollLeft: number;
  isDragging: boolean;
};

// 데스크톱에서 가로 스크롤 영역을 마우스로 끌어 넘길 수 있게 한다.
// 터치는 브라우저 기본 스크롤을 그대로 쓴다.
export function useDragScroll() {
  const dragRef = useRef<DragState | null>(null);
  const didDragRef = useRef(false);

  const endDrag = () => {
    dragRef.current = null;
  };

  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      didDragRef.current = false;
      if (event.pointerType !== 'mouse' || event.button !== 0) return;

      dragRef.current = {
        startX: event.clientX,
        startScrollLeft: event.currentTarget.scrollLeft,
        isDragging: false,
      };
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaX = event.clientX - drag.startX;
      if (!drag.isDragging) {
        if (Math.abs(deltaX) < DRAG_THRESHOLD) return;

        drag.isDragging = true;
        didDragRef.current = true;
        // 포인터가 영역 밖으로 나가도 계속 끌 수 있게 한다.
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    // 끌었다가 놓을 때 링크나 카드 클릭으로 이동하지 않게 막는다.
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (!didDragRef.current) return;

      didDragRef.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
    // 시술명 링크를 끌 때 브라우저의 링크 드래그가 시작되지 않게 한다.
    onDragStart: (event: DragEvent<HTMLElement>) => event.preventDefault(),
  };
}
