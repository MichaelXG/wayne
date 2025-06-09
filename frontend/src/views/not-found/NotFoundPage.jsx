import ErrorPage from '../../ui-component/ErrorPage';

export default function NotFoundPage() {
  return (
    <ErrorPage
      status={404}
      title="Not Found"
      description="The page you are looking for does not exist."
      image="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
    />
  );
}
