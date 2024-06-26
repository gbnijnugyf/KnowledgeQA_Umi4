import { message } from "antd";

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  // console.log(currentUser);
  const isAdmin = currentUser?.access === 'teacher';
  const userAgent = navigator.userAgent;
  // console.log(userAgent);
  let graphAccess = false;
  let isMobile = false;
  if (/mobile/i.test(userAgent)) {
    // console.log('Mobile device');
    isMobile = true
    message.info({content:'知识图谱请到电脑端查看',duration:5});
  } else if (/iPad|Android|Touch/i.test(userAgent)) {
    // console.log('Tablet');
    isMobile = true
    message.info({content:'知识图谱请到电脑端查看',duration:5});
  } else {
    // console.log('Desktop');
    graphAccess = true;
  }
  return {
    adminRoute: () => isAdmin,
    // adminRoute: () => true,
    // studRoute: () => !isAdmin,
    graphMenuAccess: () => graphAccess && !isAdmin,
    graphAccess: () => graphAccess && isAdmin,
    isMobile:()=>isMobile
    // canAdmin: currentUser && currentUser.access === 'teacher',
  };
}
