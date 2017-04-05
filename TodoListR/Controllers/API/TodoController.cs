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
                    IsDone = false
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
        public JsonResult TodoList()
        {
            return Json(_todolist);
        }
    }
}