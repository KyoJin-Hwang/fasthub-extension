function App() {
  return (
    // 전체 컨테이너: 중앙 정렬 및 배경색 설정
    <div className="flex h-screen items-center justify-center bg-slate-100 p-4">
      {/* 카드 UI 컴포넌트 */}
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        {/* 상단 아이콘 및 제목 */}
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 01-5.58-5.59H8.57a6 6 0 00-5.59 5.58l-1.28 1.28a2 2 0 002.83 2.83l1.28-1.28a6 6 0 005.58-5.59h-1.41zm5.59-5.58a6 6 0 01-5.59 5.58h-1.41a6 6 0 00-5.58-5.59l-1.28-1.28a2 2 0 002.83 2.83l1.28-1.28a6 6 0 005.59-5.58h1.41a6 6 0 015.58 5.59h1.41z"
              />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">🚀 FastHub</div>
            <p className="text-sm text-slate-500">Tailwind CSS 테스트</p>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="mt-4">
          <p className="text-red-600">
            Tailwind CSS가 성공적으로 적용되었습니다! <br />
            이제 빠르고 예쁜 UI를 만들어보세요. 제발제발ㄴㄴ
          </p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            확인 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
