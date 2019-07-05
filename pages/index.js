import fetch from 'isomorphic-unfetch';

const Index = (props) => (
  <div>
    <p>{props.shows}</p>
  </div>
);


Index.getInitialProps = async function () {
  const res = await fetch('https://backend.dci.org/api/v1/competitions?per-page=10');
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data
  };
}


export default Index;