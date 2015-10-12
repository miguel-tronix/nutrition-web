/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.webservices.restful;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

/**
 *
 * @author miguel
 */
@Embeddable
public class ReviewPK implements Serializable {
    @Basic(optional = false)
    @Column(name = "id")
    private long id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "assesmentandplan_ID")
    private long assesmentandplanID;

    public ReviewPK() {
    }

    public ReviewPK(long id, long assesmentandplanID) {
        this.id = id;
        this.assesmentandplanID = assesmentandplanID;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getAssesmentandplanID() {
        return assesmentandplanID;
    }

    public void setAssesmentandplanID(long assesmentandplanID) {
        this.assesmentandplanID = assesmentandplanID;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) id;
        hash += (int) assesmentandplanID;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof ReviewPK)) {
            return false;
        }
        ReviewPK other = (ReviewPK) object;
        if (this.id != other.id) {
            return false;
        }
        if (this.assesmentandplanID != other.assesmentandplanID) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "au.org.alfred.icu.nutrition.webservices.restful.ReviewPK[ id=" + id + ", assesmentandplanID=" + assesmentandplanID + " ]";
    }
    
}
