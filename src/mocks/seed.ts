import { DateISO } from '@/types/common'

export const notices = [
    { id: 1, title: '2025년 북극 탐사 일정 안내', author: '관리자', date: '2025-10-20' as DateISO, views: 145, category: '공지', content:'북극 탐사 일정 및 탑승 절차 안내입니다.' },
    { id: 2, title: '장비 점검 일정 변경 공지', author: '관리자', date: '2025-10-19' as DateISO, views: 98, category: '공지', content:'점검 일정이 아래와 같이 변경됩니다.' },
    { id: 3, title: '안전 교육 자료 업데이트', author: '안전팀', date: '2025-10-18' as DateISO, views: 76, category: '자료', content:'최신 교육 자료 PDF 첨부' },
    { id: 4, title: '연구장비 사용 지침서 v2.0', author: '장비팀', date: '2025-10-17' as DateISO, views: 134, category: '자료', content:'지침서 2.0 주요 변경점' },
    { id: 5, title: '월간 운영 보고서 (9월)', author: '관리자', date: '2025-10-01' as DateISO, views: 203, category: '보고서', content:'9월 운영 실적 요약' }
]

export const equipment = [
    { id: 1, name: 'CTD 센서', status: 'active', usage: 45, remaining: '235h', lastCheck: '2025-10-15' },
    { id: 2, name: '멀티빔 음향측심기', status: 'active', usage: 78, remaining: '110h', lastCheck: '2025-10-14' },
    { id: 3, name: '해수 샘플러', status: 'standby', usage: 12, remaining: '440h', lastCheck: '2025-10-16' },
    { id: 4, name: '기상 관측 장비', status: 'active', usage: 92, remaining: '40h', lastCheck: '2025-10-20' },
    { id: 5, name: '수중 카메라', status: 'standby', usage: 34, remaining: '330h', lastCheck: '2025-10-13' },
    { id: 6, name: '해저 퇴적물 채취기', status: 'inactive', usage: 5, remaining: '0h', lastCheck: '2025-10-01' }
]

export const parts = [
    { id: 1, name: 'CTD 센서 케이블', partNo: 'CTD-C-001', equipment: 'CTD 센서', type: 'SparePart', unitPrice: 350000, totalQty: 10, usedQty: 3, remainQty: 7, firstShipDate: '2024-05-15' },
    { id: 2, name: '음향측심기 트랜스듀서', partNo: 'MB-T-002', equipment: '멀티빔 음향측심기', type: 'SparePart', unitPrice: 2800000, totalQty: 5, usedQty: 1, remainQty: 4, firstShipDate: '2024-06-20' },
    { id: 3, name: '샘플러 밸브', partNo: 'WS-V-003', equipment: '해수 샘플러', type: 'Store', unitPrice: 120000, totalQty: 20, usedQty: 8, remainQty: 12, firstShipDate: '2024-07-10' },
    { id: 4, name: '기상센서 필터', partNo: 'WS-F-004', equipment: '기상 관측 장비', type: 'Store', unitPrice: 85000, totalQty: 30, usedQty: 15, remainQty: 15, firstShipDate: '2024-08-01' },
    { id: 5, name: '카메라 렌즈 보호캡', partNo: 'UC-L-005', equipment: '수중 카메라', type: 'Store', unitPrice: 45000, totalQty: 15, usedQty: 4, remainQty: 11, firstShipDate: '2024-09-05' }
]

export const inspectionLogs = [
    { id: 1, equipment: 'CTD 센서', startDate: '2025-10-15', institution: '극지연구소', user: '김연구', useStartDate: '2025-10-15', useEndDate: '2025-10-20', registrant: '이관리', purpose: '수온/염분 측정 연구' },
    { id: 2, equipment: '멀티빔 음향측심기', startDate: '2025-10-10', institution: '해양대학교', user: '박해양', useStartDate: '2025-10-10', useEndDate: '2025-10-18', registrant: '최장비', purpose: '해저 지형 매핑' },
    { id: 3, equipment: '해수 샘플러', startDate: '2025-10-12', institution: '기상청', user: '정바다', useStartDate: '2025-10-12', useEndDate: '2025-10-14', registrant: '강점검', purpose: '해수 성분 분석' },
    { id: 4, equipment: '기상 관측 장비', startDate: '2025-10-08', institution: '극지연구소', user: '한기상', useStartDate: '2025-10-08', useEndDate: '2025-10-22', registrant: '신안전', purpose: '남극 기상 관측' }
]

export const operationLogs = [
    { id: 1, equipment: 'CTD 센서', startDate: '2025-10-15', endDate: '2025-10-20', useTime: '45h', activity: '수온, 염분, 수심 측정 - 남극해 A구역', actualUser: '김연구' },
    { id: 2, equipment: '멀티빔 음향측심기', startDate: '2025-10-10', endDate: '2025-10-18', useTime: '78h', activity: '해저 지형 조사 및 매핑 작업', actualUser: '이해양' },
    { id: 3, equipment: '해수 샘플러', startDate: '2025-10-12', endDate: '2025-10-14', useTime: '12h', activity: '표층 및 심층 해수 샘플 채취', actualUser: '박바다' },
    { id: 4, equipment: '기상 관측 장비', startDate: '2025-10-08', endDate: '2025-10-22', useTime: '336h', activity: '기온, 기압, 풍속 연속 관측', actualUser: '최기상' },
    { id: 5, equipment: '수중 카메라', startDate: '2025-10-16', endDate: '2025-10-19', useTime: '28h', activity: '해저 생물 촬영 및 기록', actualUser: '정영상' }
]