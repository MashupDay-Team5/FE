type HospitalImages = {
  bannerUrl: string;
  thumbnailUrl: string;
};

const bannerImages = import.meta.glob<string>(
  '../assets/images/hospitals/banners/*.{jpg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
);
const thumbnailImages = import.meta.glob<string>(
  '../assets/images/hospitals/thumbnails/*.{jpg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
);

// 실제 API의 hospitalId와 대조한 파일명이다. 병원명으로 이미지를 추측하지 않는다.
const hospitalImageFiles: Record<
  number,
  { banner: string; thumbnail: string }
> = {
  1: {
    banner: '강남브랜드안과의원 강남점.webp',
    thumbnail: '강남브랜드안과의원 강남점.webp',
  },
  2: {
    banner: '클리어서울안과의원.webp',
    thumbnail: '클리어서울안과의원.webp',
  },
  3: {
    banner: '강남조은눈안과의원.webp',
    thumbnail: '강남조은눈안과의원.webp',
  },
  4: {
    banner: '밝은 세상안과의원 부산.webp',
    thumbnail: '밝은 세상안과의원 부산.webp',
  },
  5: {
    banner: '하늘안과의원 강남.webp',
    thumbnail: '하늘안과의원 강남.webp',
  },
  6: {
    banner: '부산하늘안과 의원.webp',
    thumbnail: '부산하늘안과 의원.webp',
  },
  7: {
    banner: '애스앤유안과의원.webp',
    thumbnail: '애스앤유안과의원.webp',
  },
  8: {
    banner: '밝음나눔안과의원 강남점.webp',
    thumbnail: '밝음나눔안과의원 강남점.webp',
  },
  9: {
    banner: '강남큐브안과의원.webp',
    thumbnail: '강남큐브안과의원.webp',
  },
  10: {
    banner: '첫눈애안과의원.webp',
    thumbnail: '첫눈애안과의원.webp',
  },
  11: {
    banner: '잠실 서울밝은안과의원.webp',
    thumbnail: '잠실 서울밝은안과의원.webp',
  },
  12: {
    banner: '명동콤비치과의원.webp',
    thumbnail: '명동콤비치과의원_썸네일.webp',
  },
  13: {
    banner: '더뉴치과의원.webp',
    thumbnail: '더뉴치과의원.webp',
  },
  14: {
    banner: '365서울치과의원.webp',
    thumbnail: '365서울치과의원.webp',
  },
  15: {
    banner: '원더플치과의원 강북점.webp',
    thumbnail: '원더플치과의원 강북점.webp',
  },
  16: {
    banner: '이수스마트치과의원.webp',
    thumbnail: '이수스마트치과의원.webp',
  },
  17: {
    banner: '뷰티앤디지털치과병원.webp',
    thumbnail: '뷰티앤디지털치과병원.webp',
  },
  18: {
    banner: '마곡바른약속치과의원.webp',
    thumbnail: '마곡바른약속치과의원.webp',
  },
  19: {
    banner: '연세다감치과의원.webp',
    thumbnail: '연세다감치과의원.webp',
  },
  20: {
    banner: '연세정원치과의원.webp',
    thumbnail: '연세정원치과의원.webp',
  },
  21: {
    banner: '서울연세치과의원 안양점.webp',
    thumbnail: '서울연세치과의원 안양점.webp',
  },
  22: {
    banner: '단단플란트치과의원.webp',
    thumbnail: '단단플란트치과의원.webp',
  },
  23: {
    banner: '서울루다치과의원.webp',
    thumbnail: '서울루다치과의원.webp',
  },
  24: {
    banner: '서울용한치과의원.webp',
    thumbnail: '서울용한치과의원.webp',
  },
  25: {
    banner: '화이트드림치과의원.webp',
    thumbnail: '화이트드림치과의원.webp',
  },
  26: {
    banner: '365서울채움치과의원.webp',
    thumbnail: '365서울채움치과의원.webp',
  },
  27: {
    banner: '연세휴치과건대점.webp',
    thumbnail: '연세휴치과건대점.webp',
  },
  28: {
    banner: '원데이치과.webp',
    thumbnail: '원데이치과.webp',
  },
  29: {
    banner: '동탄하나로치과의원.jpg',
    thumbnail: '동탄하나로치과의원.webp',
  },
  30: {
    banner: '강남더블유치과의원.webp',
    thumbnail: '강남더블유치과의원.webp',
  },
  31: {
    banner: '연세뉴치과의원 천안아산역KTX 본점.webp',
    thumbnail: '연세뉴치과의원 천안아산역KTX 본점.webp',
  },
  32: {
    banner: '연세하이디치과의원.webp',
    thumbnail: '연세하이디치과의원.webp',
  },
  33: {
    banner: '뉴엔치과의원 강남점.webp',
    thumbnail: '뉴엔치과의원 강남점.webp',
  },
  34: {
    banner: '킹덤치과의원.jpg',
    thumbnail: '킹덤치과의원.jpg',
  },
  35: {
    banner: '분당새로이치과의원.webp',
    thumbnail: '분당새로이치과의원.webp',
  },
  36: {
    banner: '원더플란트치과의원 노원점.webp',
    thumbnail: '원더플란트치과의원 노원점.webp',
  },
  37: {
    banner: '모두치과의원.jpg',
    thumbnail: '모두치과의원.webp',
  },
  38: {
    banner: '태전바른탑치과의원.webp',
    thumbnail: '태전바른탑치과의원.webp',
  },
  39: {
    banner: '365이강치과의원 청주.webp',
    thumbnail: '365이강치과의원 청주.webp',
  },
  40: {
    banner: '남양바른탑치과의원.webp',
    thumbnail: '남양바른탑치과의원.webp',
  },
  41: {
    banner: '연세원드림치과의원.webp',
    thumbnail: '연세원드림치과의원.webp',
  },
  42: {
    banner: '수원바른탑치과의원.webp',
    thumbnail: '수원바른탑치과의원.webp',
  },
  43: {
    banner: '365포천시카고치과의원.webp',
    thumbnail: '365포천시카고치과의원.webp',
  },
  44: {
    banner: '서울정형외과의원.jpg',
    thumbnail: '서울정형외과의원.jpg',
  },
  45: {
    banner: '삼성밸런스의원.webp',
    thumbnail: '삼성밸런스의원.webp',
  },
  46: {
    banner: '강동서울의원.webp',
    thumbnail: '강동서울의원.webp',
  },
  47: {
    banner: '우리의내과의원.webp',
    thumbnail: '우리의내과의원.webp',
  },
  48: {
    banner: '더힐병원.png',
    thumbnail: '더힐병원.webp',
  },
  49: {
    banner: '서울메디피아의원.webp',
    thumbnail: '서울메디피아의원.webp',
  },
  50: {
    banner: '큰힘병원.webp',
    thumbnail: '큰힘병원.webp',
  },
  51: {
    banner: '가양성모내과의원.webp',
    thumbnail: '가양성모내과의원.webp',
  },
  52: {
    banner: '광명 가득한방병원.webp',
    thumbnail: '광명 가득한방병원.webp',
  },
  53: {
    banner: '파인메디내과의원.webp',
    thumbnail: '파인메디내과의원.webp',
  },
  54: {
    banner: '모바름미작의원.webp',
    thumbnail: '모바름미작의원.webp',
  },
  55: {
    banner: '밴스모자이너의원.webp',
    thumbnail: '밴스모자이너의원.webp',
  },
  56: {
    banner: '서진성형외과의원.webp',
    thumbnail: '서진성형외과의원.webp',
  },
  57: {
    banner: '인천 맘모스헤어라인의원.webp',
    thumbnail: '인천 맘모스헤어라인의원.webp',
  },
  58: {
    banner: '바람부는날에도 성형외과의원.webp',
    thumbnail: '바람부는날에도 성형외과의원.webp',
  },
  59: {
    banner: '디엠성형외과의원.webp',
    thumbnail: '디엠성형외과의원.webp',
  },
  60: {
    banner: '티제이성형외과의원.webp',
    thumbnail: '티제이성형외과의원.webp',
  },
  61: {
    banner: '한나이브 성형외과의원.webp',
    thumbnail: '한나이브 성형외과의원.webp',
  },
  62: {
    banner: '도이준성형외과.webp',
    thumbnail: '도이준성형외과.webp',
  },
  63: {
    banner: '노엘의원.webp',
    thumbnail: '노엘의원.png',
  },
};

export function getHospitalImages(
  hospitalId: number,
): HospitalImages | undefined {
  const files = hospitalImageFiles[hospitalId];
  if (!files) return undefined;

  return {
    bannerUrl:
      bannerImages[`../assets/images/hospitals/banners/${files.banner}`],
    thumbnailUrl:
      thumbnailImages[
        `../assets/images/hospitals/thumbnails/${files.thumbnail}`
      ],
  };
}
