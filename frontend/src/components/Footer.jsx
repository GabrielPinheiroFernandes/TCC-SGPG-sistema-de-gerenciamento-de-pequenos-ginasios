import images from "../constants/images";

function Footer() {
  return (
    <footer className="bg-blue-800 py-3">
      <div className="container mx-auto flex justify-center items-center">
        <img
          src={images.logo}
          alt="Logo Studio Focus"
          className="h-16 w-auto"
        />
      </div>
    </footer>
  );
}

export default Footer;
