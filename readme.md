# node-expres-mongoose server01 

## package manager : pnpm 
> pnpm run server-debug : 개발 환경 서버 실행
>
> pnpm run server : 운영 환경 서버 실행 (pm2)

----
## build tool : gulp 
> gulp dev : 걸프 실행 

---- 

## directory

> **index.js : 서버 실행 index(socket 포함)** 
>
>
> **gulpfile.js :  걸프 관리 파일**
>
>
> **ecosystem.config.js : pm2 환경 설정**
>
> **public : 파일 디렉토리** 
> >
> > userId : 유저 아이디 로 된 폴더
> > > profile : 프로필 이미지 폴더
> > >
> > > file : 유저가 올린 파일 폴더
> > >
> > ...
> 
> 
> 
> **src/src_dist : 개발/운영 환경**
> >
> > api
> > > api.account.js : api 로그인, 회원가입 등등
> > >
> > > api.auth.js : 토큰 인증 관련 api
> > >
> > > api.favorite.js : 좋아요 한 전시 관련 api 
> > >
> > > api.files.js : 파일업로드 관련 api 
> > >
> > > api.mail.js : 메일전송 관련 api 
> > >
> > > api.meeting.js : 모임 관련 api
> > >
> > > api.message.js : 1:1 메세지 관련 api
> > >
> > > api.user.js : 유저 정보 관련 api
> > >
>
> > middleware
> > > middleware.apiLimit.js
> > >
> > > middleware.auth.js : 토큰 인증 미들웨어
> > >
>
> > model
> > > favorite.js : 좋아요 한 전시 데이터 모델
> > >
> > > meeting.js : 모임 데이터 모델
> > >
> > > message.js : 메세지 데이터 모델
> > >
> > > response.js : 리스폰스 모델
> > >
> > > user.js : 유저 데이터 모델
> > >
>
> > router
> > > route.account.js : 로그인, 회원가입 등등 라우터
> > >
> > > route.auth.js : 인증 관련 라우터
> > >
> > > route.favorite.js : 좋아요 한 전시 관련 라우터
> > >
> > > route.files.js : 파일업로드 관련 라우터
> > >
> > > route.mail.js : 메일전송 관련 라우터
> > >
> > > route.meeting.js : 모임 관련 라우터
> > >
> > > route.message.js : 1:1 메세지 관련 라우터
> > >
> > > route.user.js : 유저 정보 관련 라우터
> > >
> > > router.socket.js : socket 관련 라우터 (1:1 매세지)
> 
> > util
> > > bcrypt.js : 비밀번호 암호화
> > >
> > > checkDuplicate.js : 회원중복 검사
> > >
> > > compression.js : 문자열 압축, 압축해제
> > >
> > > crpyto.js : crpyto.js 관련 암호화, 복호화
> > >
> > > dateParse.js : 날짜 변환 ex) yyyy.mm.dd hh:mm:ss
> > >
> > > generateRandomCode.js : 날짜 변환 ex) yyyy.mm.dd hh:mm:ss
> > >
> > > isDuplicateCalls.js  : 랜덤 키 생성 (메일 인증)
> > >
> > > token.js : jwt 토큰 관련
> > >