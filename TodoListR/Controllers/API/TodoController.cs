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
        private static int _idCounter = 4;

        static TodoController()
        {
            _todolist = new List<TodoModel>()
            {
                new TodoModel()
                {
                    Id = 1,
                    TodoTitle = "Todo 1",
                    IsDone = true
                },
                new TodoModel()
                {
                    Id = 2,
                    TodoTitle = "Todo 2",
                    IsDone = false
                },
                new TodoModel()
                {
                    Id = 3,
                    TodoTitle = "Todo 3",
                    IsDone = false
                }
            };
        }

        [HttpGet("api/Todo/{id:int}")]
        public TodoModel Index(int id)
        {
            var todo = _todolist.FirstOrDefault<TodoModel>(x => x.Id == id);
            return todo;
        }

        [HttpGet("api/Todos")]
        public JsonResult GetTodoList()
        {
            return Json(_todolist);
        }

        [HttpPost("api/Todo")]
        public ApiResultModel CreateTodo([FromBody]TodoModel todo)
        {
            var result = new ApiResultModel() { Success = false };
            if (todo == null || string.IsNullOrEmpty(todo.TodoTitle))
            {
                return result;
            }

            todo.Id = _idCounter++;
            _todolist.Add(todo);

            result.Success = true;
            result.data = todo;

            return result;
        }

        [HttpPut("api/Todo")]
        public bool UpdateTodo([FromBody]TodoModel todo)
        {
            if (todo == null || string.IsNullOrEmpty(todo.TodoTitle))
            {
                return false;
            }

            var t = _todolist.FirstOrDefault(x => x.Id == todo.Id);

            t.TodoTitle = todo.TodoTitle;
            t.IsDone = todo.IsDone;

            return true;
        }

        [HttpDelete("api/Todo")]
        public bool DeleteTodo([FromBody]int id)
        {
            var t = _todolist.FirstOrDefault(x => x.Id == id);
            if (t == null)
            {
                return false;
            }

            return _todolist.Remove(t);
        }
    }
}