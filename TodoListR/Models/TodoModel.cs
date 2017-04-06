using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListR.Models
{
    public class TodoModel
    {
        public long? Id { get; set; }
        public string TodoTitle { get; set; }
        public bool IsDone { get; set; }
    }
}
