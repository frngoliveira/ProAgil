using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using ProAgil.Repository;
using ProAgil.Api.Dtos;
using ProAgil.Domain;
using AutoMapper;
using System;
using System.Web;
using System.IO;

namespace ProAgil.Api.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;
        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        #region Metodos Get

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try 
            {
                var eventos = await _repo.GetAllEventoAsync(true);
                var result = _mapper.Map<EventoDto[]>(eventos);

                return Ok(result);
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");               
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try 
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true);

                var result = _mapper.Map<EventoDto>(evento);

                return Ok(result);
            }
            catch(Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try 
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema, true);
                var result = _mapper.Map<EventoDto[]>(eventos);
                return Ok(result);
            }
            catch(Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }
        [HttpPost("upload")]
        public async Task<IActionResult> Upload()
        {
            try 
            {
                var files = Request.Form.Files[0];
                var folderName = Path.Combine("Resource", "Images");
                return Ok();
            }
            catch(Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");               
            }
        }
        #endregion

        #region CRUD
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try 
            {
                var evento = _mapper.Map<Evento>(model);

                _repo.Add(evento);
                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");               
            }
            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try 
            {
                //Evento model= new Evento();

                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if(evento == null) return NotFound();

                _mapper.Map(model, evento);

                _repo.Update(evento);
                
                if(await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}",  _mapper.Map<EventoDto>(evento));
                }
            }
            catch(Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de Dados Falhou {ex.Message}");               
            }                                      
            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try 
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if(evento == null) return NotFound();

                _repo.Delete(evento);
                if(await _repo.SaveChangesAsync())
                {
                    return Ok();
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