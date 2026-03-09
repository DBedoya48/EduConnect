function CommentList({ comments, user, editComment, deleteComment }) {
  console.log("Estructura del comentario:", comments[0]);
  return (
    <div>
      {comments?.map((comment) => (
        <div
          key={comment.id}
          className="text-sm flex justify-between items-center border-b py-1"
        >
          <div>
            <span className="font-semibold">{comment.user}</span>{" "}
            {comment.content}
          </div>

          {user?.username === comment.user && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newContent = prompt(
                    "Editar comentario",
                    comment.content
                  );
                  if (newContent) editComment(comment.id, newContent);
                }}
                className="text-blue-500"
              >
                Editar
              </button>

              <button
                onClick={() => deleteComment(comment.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentList;