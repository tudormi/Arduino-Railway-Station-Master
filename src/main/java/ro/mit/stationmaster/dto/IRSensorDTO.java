package ro.mit.stationmaster.dto;

/**
 * Created by tmatrescu on 4/6/2015.
 */
public class IRSensorDTO {

    private int track;
    private String state;

    public IRSensorDTO() {
    }

    public IRSensorDTO(int track, String state) {
        this.track = track;
        this.state = state;
    }

    public int getTrack() {
        return track;
    }

    public void setTrack(int track) {
        this.track = track;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
