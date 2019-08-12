using backEnd.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace backEnd.Controllers
{
    public class TrainingInfoController : ApiController
    {
        // GET: api/TrainingInfo
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/TrainingInfo/5
        public string Get(int id)
        {
            return "value";
        }


        // POST: api/TrainingInfo
        [HttpPost]
        public IHttpActionResult Post([FromBody]TrainingInformation value)
        {
            using (var db = new TrainingInformationEntities())
            {
                if(value.TrainingName.Length == 0 || value.DateOfStart == null || value.DateOfEnd == null)
                {
                    return BadRequest("training information not correct");
                }

                if(DateTime.Compare(value.DateOfStart, value.DateOfEnd) > 0)
                {
                    return BadRequest("Start Date should be earlier than End Date");
                }

                try
                {
                    db.TrainingInformations.Add(value);
                    db.SaveChanges();
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    return BadRequest(ex.Message);
                }catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

                return Ok("save successfully");

            }
        }

        // PUT: api/TrainingInfo/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/TrainingInfo/5
        public void Delete(int id)
        {
        }
    }
}
