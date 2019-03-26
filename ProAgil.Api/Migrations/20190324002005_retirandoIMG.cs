using Microsoft.EntityFrameworkCore.Migrations;

namespace ProAgil.Api.Migrations
{
    public partial class retirandoIMG : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagemUrl",
                table: "Eventos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagemUrl",
                table: "Eventos",
                nullable: true);
        }
    }
}
