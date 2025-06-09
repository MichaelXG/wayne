
import ErrorPage from '../../ui-component/ErrorPage';

export default function ServerErrorPage() {

  return (
    <ErrorPage
      status={500}
      title="Server Error"
      description="Oops! Something went wrong on our end."
      image="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
    />
  );
}
