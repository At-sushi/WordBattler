namespace WordBattlerWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class IDAdded : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.BattlerInfoes");
            AddColumn("dbo.BattlerInfoes", "Id", c => c.String(nullable: false, maxLength: 30));
            AddPrimaryKey("dbo.BattlerInfoes", "Id");
        }
        
        public override void Down()
        {
            DropPrimaryKey("dbo.BattlerInfoes");
            DropColumn("dbo.BattlerInfoes", "Id");
            AddPrimaryKey("dbo.BattlerInfoes", "Name");
        }
    }
}
