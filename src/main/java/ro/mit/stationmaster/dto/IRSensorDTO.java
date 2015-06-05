package ro.mit.stationmaster.dto;

/**
 * Created by tmatrescu on 4/6/2015.
 */
public class IRSensorDTO {

    private int track;
    private String state;
    private int orientation;

    public IRSensorDTO() {
    }

    public IRSensorDTO(int track, String state, int orientation) {
        this.track = track;
        this.state = state;
        this.orientation = orientation;
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

    public int getOrientation() {
        return orientation;
    }

    public void setOrientation(int orientation) {
        this.orientation = orientation;
    }
}
