const Home = () => {
  // const host = 'http://localhost:8123/api';
  const host = 'https://loginx.onrender.com/api'
  const loginWithGithub = async () => {
    try {
      // Redirect to the GitHub authentication route
      window.location.href = `${host}/auth/github`;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
    const loginWithX = async () => {
    try {
      // Redirect to the GitHub authentication route
      window.location.href = `${host}/auth/twitter`;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${host}/auth/github/callback`, {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent with the request
      });

      const data = await response.json();

      if (data.success) {
        console.log('User data:', data.user);

        // Save user data to state (e.g., React state, Redux, or localStorage)
        localStorage.setItem('user', JSON.stringify(data.user));

        // Display the user information
        alert(`Welcome ${data.user.username}`);
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  return <>
    <button onClick={loginWithGithub}>Login with Github</button>
    <button onClick={loginWithX}>Login with Twitter</button>
    <button onClick={fetchUser}>Fetch User Data</button>

  </>
}
export default Home;