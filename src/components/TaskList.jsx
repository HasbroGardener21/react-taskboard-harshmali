import TaskItem from './TaskItem'

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No tasks yet. Add one above.</p>
  }

  return (
    <div>
      {tasks.map((task, index) => (
        <TaskItem key={task.id} task={task} index={index} total={tasks.length} />
      ))}
    </div>
  )
}

export default TaskList