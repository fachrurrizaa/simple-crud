export default function Button({ content, className, click, type }) {
    return (
      <button className={`btn outline-none border-none rounded-full ${className}`} onClick={click} type={type}>{content}</button>
    )
  }
  