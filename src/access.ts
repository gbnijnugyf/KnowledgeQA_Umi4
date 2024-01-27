/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser);
  const isAdmin = currentUser?.access === 'teacher';
  return {
    adminRoute: () => isAdmin,
    canAdmin: currentUser && currentUser.access === 'teacher',
  };
}
