namespace WordBattlerWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dateadded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.BattlerInfoes", "Registered", c => c.DateTime(nullable: false));
            AddColumn("dbo.BattlerInfoes", "LastLogined", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.BattlerInfoes", "LastLogined");
            DropColumn("dbo.BattlerInfoes", "Registered");
        }
    }
}
