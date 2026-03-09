import axios from "../../api/axios";

function CommentForm({ postId, refreshPosts }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.comment.value;

    try {
      await axios.post(`/posts/${postId}/comment/`, { content });
      refreshPosts();
      e.target.reset();
    } catch (error) {
      console.error("Error creando comentario", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="comment"
        placeholder="Escribe un comentario..."
        className="w-full border rounded-lg p-2 mt-3"
      />
    </form>
  );
}

export default CommentForm;