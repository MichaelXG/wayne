import ErrorPage from '../../ui-component/ErrorPage';

export default function ForbiddenPage() {
  return (
    <ErrorPage
      status={403}
      title="Forbidden"
      description="You do not have permission to access this page."
      image="https://cdn-icons-png.flaticon.com/512/1828/1828490.png"
    />
  );
}
