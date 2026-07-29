public class TripDto
{
    public int TripId { get; set; }
    public string TripName { get; set; }
    public string Destination { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public float Price { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }

    public string Imgdesc { get; set; }

}
