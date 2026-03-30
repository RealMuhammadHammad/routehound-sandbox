export default function UserProfile({ userInput }) {
  // DANGER: Directly rendering unsanitized user input allows hackers to steal cookies!
  return (
    <div dangerouslySetInnerHTML={{ __html: userInput }} />
  );
}
