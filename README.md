# FORM / PLAY — Creative Portfolio

동일한 인물의 시각적 변화를 탐구하는 독립 AI 비주얼 아트 디렉션 프로젝트입니다. HOME, VISUAL LAB, YOUR FRAME, STUDIES, PROCESS, ABOUT의 여섯 섹션으로 구성됩니다. RAWLANDY와는 별개의 정적 사이트이며 관련 홈페이지나 파일을 수정하지 않습니다.

## 로컬 실행

`index.html`을 브라우저에서 직접 열면 바로 동작합니다. 개발용 로컬 서버를 선호한다면 VS Code의 Live Server처럼 정적 파일을 제공하는 도구로 이 폴더를 열어도 됩니다.

## 이미지 교체

현재 화면은 `assets/images/` 안의 다음 파일을 사용합니다.

- `model-v2-source.png` — Visual Lab 원본
- `model-v2-editorial.png` — Editorial 결과
- `model-v2-cinematic.png` — Cinematic 결과
- `model-v2-minimal.png` — Minimal 결과

이미지를 교체할 때는 같은 파일명을 유지하세요. 권장 비율은 현재 에셋과 같은 약 3:4 세로형이며, 네 이미지에서 얼굴 중심과 눈높이를 최대한 맞추면 비교가 자연스럽습니다. `before.png`와 `after-*.png` 파일은 이전 버전 보존용이며 현재 HTML에서는 사용하지 않습니다.

## YOUR FRAME 방문자 체험

YOUR FRAME은 방문자가 자신의 JPG, PNG 또는 WEBP 이미지를 선택해 Editorial, Cinematic, Minimal의 색감과 조명을 브라우저에서 비교하는 기능입니다.

1. `SELECT IMAGE`를 누르거나 이미지를 업로드 영역에 끌어 놓습니다.
2. 세 가지 방향 중 하나를 선택합니다.
3. 비교 슬라이더를 마우스, 터치 또는 키보드 방향키로 움직입니다.
4. `DOWNLOAD PNG`로 현재 결과만 저장합니다.

사진은 `Canvas API`를 통해 현재 브라우저 메모리에서만 처리됩니다. 외부 서버 전송, 계정 저장, 영구 보관을 하지 않으며 초기화 또는 이미지 변경 시 기존 이미지 참조를 해제합니다. 15MB 이하, 4천만 픽셀 이하 이미지를 지원하고 처리용 캔버스의 긴 변은 최대 2400px로 축소합니다.

이 기능은 실제 AI 이미지 생성이나 얼굴 변환이 아닙니다. CSS/Canvas 기반의 색감·명암·조명 시뮬레이션이며, STUDIES에 전시된 사전 제작 AI 결과물과 구분됩니다.

## 로컬 관리자 편집 화면

관리자 화면은 공개 메뉴에 연결하지 않은 `admin.html`입니다. 정적 사이트이므로 로그인이나 서버 영구 저장 기능은 없으며, 관리자 화면을 GitHub Pages에 함께 올리더라도 URL을 아는 사람이 접근할 수 있습니다. **배포용 ZIP 만들기**는 관리자 파일을 제외한 공개용 ZIP을 만들고, **관리자 도구 ZIP 만들기**는 관리자 파일까지 포함한 개인 보관용 ZIP을 만듭니다.

ZIP 만들기 기능은 보안 정책상 `index.html`을 더블클릭한 `file://` 환경이 아니라 로컬 서버에서 사용해야 합니다. 이 폴더에서 아래 중 한 가지로 실행하세요.

- VS Code Live Server로 폴더 열기
- Python이 설치된 경우 `python -m http.server 8000` 실행 후 `http://localhost:8000/admin.html` 접속

관리자 화면에서 SOURCE, Editorial, Cinematic, Minimal 이미지를 선택하고 작품 문구를 바꿀 수 있습니다. **배포용 ZIP 만들기**를 누르면 기존 이미지 자료와 사이트 파일을 보존하면서 선택한 이미지와 설정을 반영한 `form-play-public-deploy.zip`을 내려받습니다. 이 ZIP을 풀어 확인한 뒤 GitHub 저장소의 기존 FORM / PLAY 파일을 교체하고 커밋해야 실제 사이트에 반영됩니다.

`이 브라우저에 임시 저장`은 문구만 브라우저 로컬 저장소에 보관합니다. 브라우저 보안상 업로드 이미지 자체는 보관하지 않으므로 다시 접속하면 이미지를 다시 선택해야 합니다. 설정 JSON은 문구 백업·복원용입니다.

공개 GitHub Pages에는 `form-play-public-deploy.zip`의 내용만 올리세요. `admin.html`, `admin.css`, `admin.js`는 공개 ZIP에 포함되지 않습니다. 관리자 도구는 `form-play-admin-tool.zip`을 개인 컴퓨터에 보관해 로컬 서버에서 실행합니다.

## 인터랙션

- 첫 방문 인트로는 같은 탭에서 한 번만 재생되며 `SKIP INTRO`로 건너뛸 수 있습니다.
- 모션 감소 설정과 터치 기기에서는 인트로·커스텀 커서 효과가 자동으로 축소됩니다.
- Visual Lab의 콘셉트 버튼은 이미지, 설명과 배경 분위기를 함께 전환합니다.
- Studies 이미지는 클릭하거나 키보드 Enter/Space로 확대해 볼 수 있습니다.
- 모바일에서는 헤더의 MENU 버튼으로 전체 섹션을 이동할 수 있으며 Escape 키로 메뉴를 닫을 수 있습니다.
- SKIP INTRO는 인트로를 즉시 종료하고 HOME 제목으로 키보드 포커스를 이동합니다.
- PROCESS의 사례 보드는 Source → Direction → Result 순서로 실제 판단 기준을 보여줍니다.
- 커스텀 커서는 포인터가 움직일 때만 애니메이션 프레임을 사용하고, 텍스트 입력 영역에서는 기본 커서를 유지합니다.
- 배포 파일명은 `index.html`이며 `assets/images/`를 포함한 폴더 전체를 함께 업로드해야 합니다.

VISUAL LAB의 표시 문구는 `script.js`의 `styles` 객체에서 수정할 수 있습니다. STUDIES와 ABOUT의 설명은 `index.html`에서 교체하세요.

## GitHub Pages

저장소에 `form-play` 폴더 내용을 올린 뒤 GitHub 저장소의 Settings → Pages에서 배포 브랜치와 루트 폴더를 선택하면 됩니다. 별도 빌드 과정이나 API 키가 필요하지 않습니다.

## 구성

- 순수 HTML / CSS / JavaScript
- 반응형 레이아웃
- 키보드 접근 가능한 콘셉트 버튼과 비교 슬라이더
- `prefers-reduced-motion` 대응
- 외부 데이터 전송 및 유료 API 없음

## 검수 범위와 알려진 제약

- JavaScript 문법, 내부 파일 참조, 필수 에셋, 공개/관리자 ZIP 구조를 자동 검사합니다.
- 관리자 ZIP 생성기의 ZIP 형식은 생성 후 재해제 검사합니다.
- 브라우저 자동화가 가능한 환경에서는 인트로, 메뉴, 비교 슬라이더, 라이트박스, 업로드, 스타일 전환과 PNG 다운로드를 추가로 확인하세요.
- 모바일 실제 기기의 파일 선택기와 다운로드 위치는 운영체제·브라우저에 따라 다릅니다.
- Canvas가 지원되지 않는 오래된 브라우저에서는 YOUR FRAME을 사용할 수 없습니다. 최신 Chrome, Edge, Safari, Firefox 사용을 권장합니다.
