namespace WordBattlerWeb.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PointSumImplemented : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BattlerInfoes",
                c => new
                    {
                        Name = c.String(nullable: false, maxLength: 30),
                        BattlePointSum = c.Int(nullable: false),
                        BattlerAccountInfo_Password = c.String(nullable: false, maxLength: 200),
                        BattlerAccountInfo_Character = c.String(nullable: false, maxLength: 200),
                        BattlePoint_Attack = c.Int(nullable: false),
                        BattlePoint_Defense = c.Int(nullable: false),
                        BattlePoint_Speed = c.Int(nullable: false),
                        BattlePoint_Luck = c.Int(nullable: false),
                        HiddenBattlePoint_Attack = c.Int(nullable: false),
                        HiddenBattlePoint_Defense = c.Int(nullable: false),
                        HiddenBattlePoint_Speed = c.Int(nullable: false),
                        HiddenBattlePoint_Luck = c.Int(nullable: false),
                        BattleResult_Won = c.Int(nullable: false),
                        BattleResult_Lost = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Name)
                .Index(t => t.BattlePointSum);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.BattlerInfoes", new[] { "BattlePointSum" });
            DropTable("dbo.BattlerInfoes");
        }
    }
}
