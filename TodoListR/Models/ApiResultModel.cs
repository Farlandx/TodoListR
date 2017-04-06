using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoListR.Models
{
    public class ApiResultModel
    {
        public bool Success { get; set; }
        public object data { get; set; }
    }
}
