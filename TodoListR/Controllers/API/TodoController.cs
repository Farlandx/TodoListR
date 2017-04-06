using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TodoListR.Models;

namespace TodoListR.Controllers.API
{
    [Produces("application/json")]
    public class TodoController : Controller
    {
        private static readonly IList<TodoModel> _todolist;

        static TodoController()
        {
            _todolist = new List<TodoModel>()
            {
                new TodoModel()
                {
                    id = 1,
                    TodoTitle = "°_§É",
                    IsDone = true
                },
                new TodoModel()
                {
                    id = 2,
                    TodoTitle = "¨ê¤ú¬~Áy",
                    IsDone = false
                },
                new TodoModel()
                {
                    id = 3,
                    TodoTitle = "¤W¯Z¥h",
                    IsDone = false
                }
            };
        }

        [HttpGet("api/Todo/{id:int}")]
        public TodoModel Index(int? id)
        {
            var todo = _todolist.FirstOrDefault<TodoModel>(x => x.id == id);
            return todo;
        }

        [HttpGet("api/Todos")]
        public JsonResult GetTodoList()
        {
            return Json(_todolist);
        }

        [HttpPost("api/Todo")]
        public bool CreateTodo(TodoModel todo)
        {
            if (string.IsNullOrEmpty(todo.TodoTitle))
            {
                return false;
            }

            todo.id = _todolist.Count() + 1;
            _todolist.Add(todo);

            return true;
        }

        [HttpPut("api/Todo")]
        public bool UpdateTodo(TodoModel todo)
        {
            if (string.IsNullOrEmpty(todo.TodoTitle))
            {
                return false;
            }

            var t = _todolist.FirstOrDefault(x => x.id == todo.id);

            t.TodoTitle = todo.TodoTitle;
            t.IsDone = todo.IsDone;

            return true;
        }

        [HttpDelete("api/Todo")]
        public bool DeleteTodo(int id)
        {
            var t = _todolist.FirstOrDefault(x => x.id == id);
            if (t == null)
            {
                return false;
            }

            return _todolist.Remove(t);
        }
    }
}