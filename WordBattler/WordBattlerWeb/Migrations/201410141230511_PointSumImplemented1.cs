namespace WordBattlerWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PointSumImplemented1 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.BattlerInfoes", "BattlerAccountInfo_Password", c => c.String(nullable: false, maxLength: 100));
            AlterColumn("dbo.BattlerInfoes", "BattlerAccountInfo_Character", c => c.String(nullable: false, maxLength: 30));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.BattlerInfoes", "BattlerAccountInfo_Character", c => c.String(nullable: false, maxLength: 200));
            AlterColumn("dbo.BattlerInfoes", "BattlerAccountInfo_Password", c => c.String(nullable: false, maxLength: 200));
        }
    }
}
