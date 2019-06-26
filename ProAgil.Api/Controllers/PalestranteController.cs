using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using ProAgil.Domain;
using ProAgil.Repository;
using System;

namespace ProAgil.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repo;
        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int Id)
        {
            try
            {
                var result = await _repo.GetPalestranteAsync(Id, true);

                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }
        }
        
        [HttpGet("getByName/{name}")]
        public async Task<IActionResult> Get(string name)
        {
            try
            {
                var result = await _repo.GetAllPalestranteAsyncByName(name, true);
                return Ok(result);
            }
            catch (Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }
        }

        ///////////////////////////////////Crud
        #region CRUD
        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try 
            {
                _repo.Add(model);
                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/palestrante/{model.Nome}", model);
                }
            }
            catch(Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
            return BadRequest();
        }
        #endregion
    } 
}
