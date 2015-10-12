/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package au.org.alfred.icu.nutrition.webservices.restful;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author miguel
 */
@Entity
@Table(name = "review")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Review.findAll", query = "SELECT r FROM Review r"),
    @NamedQuery(name = "Review.findByENrecieved", query = "SELECT r FROM Review r WHERE r.eNrecieved = :eNrecieved"),
    @NamedQuery(name = "Review.findByICUAdmId", query = "SELECT r FROM Review r WHERE r.iCUAdmId = :iCUAdmId"),
    @NamedQuery(name = "Review.findByOralProteinReceived", query = "SELECT r FROM Review r WHERE r.oralProteinReceived = :oralProteinReceived"),
    @NamedQuery(name = "Review.findByPNreceived", query = "SELECT r FROM Review r WHERE r.pNreceived = :pNreceived"),
    @NamedQuery(name = "Review.findByApColoxyl", query = "SELECT r FROM Review r WHERE r.apColoxyl = :apColoxyl"),
    @NamedQuery(name = "Review.findByApEnema", query = "SELECT r FROM Review r WHERE r.apEnema = :apEnema"),
    @NamedQuery(name = "Review.findByApFleet", query = "SELECT r FROM Review r WHERE r.apFleet = :apFleet"),
    @NamedQuery(name = "Review.findByApGolytely", query = "SELECT r FROM Review r WHERE r.apGolytely = :apGolytely"),
    @NamedQuery(name = "Review.findByApLactulose", query = "SELECT r FROM Review r WHERE r.apLactulose = :apLactulose"),
    @NamedQuery(name = "Review.findByApMovicol", query = "SELECT r FROM Review r WHERE r.apMovicol = :apMovicol"),
    @NamedQuery(name = "Review.findByAssesmentDate", query = "SELECT r FROM Review r WHERE r.assesmentDate = :assesmentDate"),
    @NamedQuery(name = "Review.findByBowelActions", query = "SELECT r FROM Review r WHERE r.bowelActions = :bowelActions"),
    @NamedQuery(name = "Review.findById", query = "SELECT r FROM Review r WHERE r.reviewPK.id = :id"),
    @NamedQuery(name = "Review.findByNumberOfGastricAspirate", query = "SELECT r FROM Review r WHERE r.numberOfGastricAspirate = :numberOfGastricAspirate"),
    @NamedQuery(name = "Review.findByPkErythromycin", query = "SELECT r FROM Review r WHERE r.pkErythromycin = :pkErythromycin"),
    @NamedQuery(name = "Review.findByPkMetoclopramide", query = "SELECT r FROM Review r WHERE r.pkMetoclopramide = :pkMetoclopramide"),
    @NamedQuery(name = "Review.findByPkOther", query = "SELECT r FROM Review r WHERE r.pkOther = :pkOther"),
    @NamedQuery(name = "Review.findByReviewComment", query = "SELECT r FROM Review r WHERE r.reviewComment = :reviewComment"),
    @NamedQuery(name = "Review.findByTotalGastricApirateVolume", query = "SELECT r FROM Review r WHERE r.totalGastricApirateVolume = :totalGastricApirateVolume"),
    @NamedQuery(name = "Review.findByAssesmentandplanID", query = "SELECT r FROM Review r WHERE r.reviewPK.assesmentandplanID = :assesmentandplanID"),
    @NamedQuery(name = "Review.findByReviewDate", query = "SELECT r FROM Review r WHERE r.reviewDate = :reviewDate"),
    @NamedQuery(name = "Review.findByReviewDietician", query = "SELECT r FROM Review r WHERE r.reviewDietician = :reviewDietician"),
    @NamedQuery(name = "Review.findByOralEnergyReceived", query = "SELECT r FROM Review r WHERE r.oralEnergyReceived = :oralEnergyReceived"),
    @NamedQuery(name = "Review.findByApCerner", query = "SELECT r FROM Review r WHERE r.apCerner = :apCerner"),
    @NamedQuery(name = "Review.findByFineBore", query = "SELECT r FROM Review r WHERE r.fineBore = :fineBore"),
    @NamedQuery(name = "Review.findByPkNone", query = "SELECT r FROM Review r WHERE r.pkNone = :pkNone"),
    @NamedQuery(name = "Review.findByPkNotGiven", query = "SELECT r FROM Review r WHERE r.pkNotGiven = :pkNotGiven"),
    @NamedQuery(name = "Review.findByApNotGiven", query = "SELECT r FROM Review r WHERE r.apNotGiven = :apNotGiven"),
    @NamedQuery(name = "Review.findByFlexiseal", query = "SELECT r FROM Review r WHERE r.flexiseal = :flexiseal"),
    @NamedQuery(name = "Review.findByFlexisealVolume", query = "SELECT r FROM Review r WHERE r.flexisealVolume = :flexisealVolume"),
    @NamedQuery(name = "Review.findByVomitVolume", query = "SELECT r FROM Review r WHERE r.vomitVolume = :vomitVolume"),
    @NamedQuery(name = "Review.findByVomit", query = "SELECT r FROM Review r WHERE r.vomit = :vomit"),
    @NamedQuery(name = "Review.findByPropofol", query = "SELECT r FROM Review r WHERE r.propofol = :propofol")})
public class Review implements Serializable {
    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected ReviewPK reviewPK;
    @Column(name = "ENrecieved")
    private BigInteger eNrecieved;
    @Size(max = 45)
    @Column(name = "ICUAdmId")
    private String iCUAdmId;
    @Column(name = "OralProteinReceived")
    private BigInteger oralProteinReceived;
    @Column(name = "PNreceived")
    private BigInteger pNreceived;
    @Column(name = "apColoxyl")
    private Boolean apColoxyl;
    @Column(name = "apEnema")
    private Boolean apEnema;
    @Column(name = "apFleet")
    private Boolean apFleet;
    @Column(name = "apGo_lytely")
    private Boolean apGolytely;
    @Column(name = "apLactulose")
    private Boolean apLactulose;
    @Column(name = "apMovicol")
    private Boolean apMovicol;
    @Column(name = "assesmentDate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date assesmentDate;
    @Column(name = "bowelActions")
    private BigInteger bowelActions;
    @Column(name = "numberOfGastricAspirate")
    private BigInteger numberOfGastricAspirate;
    @Column(name = "pkErythromycin")
    private Boolean pkErythromycin;
    @Column(name = "pkMetoclopramide")
    private Boolean pkMetoclopramide;
    @Size(max = 45)
    @Column(name = "pkOther")
    private String pkOther;
    @Size(max = 1000)
    @Column(name = "reviewComment")
    private String reviewComment;
    @Column(name = "totalGastricApirateVolume")
    private BigInteger totalGastricApirateVolume;
    @Column(name = "reviewDate")
    @Temporal(TemporalType.TIMESTAMP)
    private Date reviewDate;
    @Size(max = 100)
    @Column(name = "reviewDietician")
    private String reviewDietician;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "OralEnergyReceived")
    private Double oralEnergyReceived;
    @Column(name = "apCerner")
    private Boolean apCerner;
    @Column(name = "fineBore")
    private Boolean fineBore;
    @Column(name = "pkNone")
    private Boolean pkNone;
    @Column(name = "pkNotGiven")
    private Boolean pkNotGiven;
    @Column(name = "apNotGiven")
    private Boolean apNotGiven;
    @Column(name = "flexiseal")
    private Boolean flexiseal;
    @Column(name = "flexisealVolume")
    private BigInteger flexisealVolume;
    @Column(name = "vomitVolume")
    private BigInteger vomitVolume;
    @Column(name = "vomit")
    private Boolean vomit;
    @Basic(optional = false)
    @NotNull
    @Column(name = "propofol")
    private long propofol;
    @JoinColumn(name = "assesmentandplan_ID", referencedColumnName = "ID", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Assesmentandplan assesmentandplan;

    public Review() {
    }

    public Review(ReviewPK reviewPK) {
        this.reviewPK = reviewPK;
    }

    public Review(ReviewPK reviewPK, long propofol) {
        this.reviewPK = reviewPK;
        this.propofol = propofol;
    }

    public Review(long id, long assesmentandplanID) {
        this.reviewPK = new ReviewPK(id, assesmentandplanID);
    }

    public ReviewPK getReviewPK() {
        return reviewPK;
    }

    public void setReviewPK(ReviewPK reviewPK) {
        this.reviewPK = reviewPK;
    }

    public BigInteger getENrecieved() {
        return eNrecieved;
    }

    public void setENrecieved(BigInteger eNrecieved) {
        this.eNrecieved = eNrecieved;
    }

    public String getICUAdmId() {
        return iCUAdmId;
    }

    public void setICUAdmId(String iCUAdmId) {
        this.iCUAdmId = iCUAdmId;
    }

    public BigInteger getOralProteinReceived() {
        return oralProteinReceived;
    }

    public void setOralProteinReceived(BigInteger oralProteinReceived) {
        this.oralProteinReceived = oralProteinReceived;
    }

    public BigInteger getPNreceived() {
        return pNreceived;
    }

    public void setPNreceived(BigInteger pNreceived) {
        this.pNreceived = pNreceived;
    }

    public Boolean getApColoxyl() {
        return apColoxyl;
    }

    public void setApColoxyl(Boolean apColoxyl) {
        this.apColoxyl = apColoxyl;
    }

    public Boolean getApEnema() {
        return apEnema;
    }

    public void setApEnema(Boolean apEnema) {
        this.apEnema = apEnema;
    }

    public Boolean getApFleet() {
        return apFleet;
    }

    public void setApFleet(Boolean apFleet) {
        this.apFleet = apFleet;
    }

    public Boolean getApGolytely() {
        return apGolytely;
    }

    public void setApGolytely(Boolean apGolytely) {
        this.apGolytely = apGolytely;
    }

    public Boolean getApLactulose() {
        return apLactulose;
    }

    public void setApLactulose(Boolean apLactulose) {
        this.apLactulose = apLactulose;
    }

    public Boolean getApMovicol() {
        return apMovicol;
    }

    public void setApMovicol(Boolean apMovicol) {
        this.apMovicol = apMovicol;
    }

    public Date getAssesmentDate() {
        return assesmentDate;
    }

    public void setAssesmentDate(Date assesmentDate) {
        this.assesmentDate = assesmentDate;
    }

    public BigInteger getBowelActions() {
        return bowelActions;
    }

    public void setBowelActions(BigInteger bowelActions) {
        this.bowelActions = bowelActions;
    }

    public BigInteger getNumberOfGastricAspirate() {
        return numberOfGastricAspirate;
    }

    public void setNumberOfGastricAspirate(BigInteger numberOfGastricAspirate) {
        this.numberOfGastricAspirate = numberOfGastricAspirate;
    }

    public Boolean getPkErythromycin() {
        return pkErythromycin;
    }

    public void setPkErythromycin(Boolean pkErythromycin) {
        this.pkErythromycin = pkErythromycin;
    }

    public Boolean getPkMetoclopramide() {
        return pkMetoclopramide;
    }

    public void setPkMetoclopramide(Boolean pkMetoclopramide) {
        this.pkMetoclopramide = pkMetoclopramide;
    }

    public String getPkOther() {
        return pkOther;
    }

    public void setPkOther(String pkOther) {
        this.pkOther = pkOther;
    }

    public String getReviewComment() {
        return reviewComment;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }

    public BigInteger getTotalGastricApirateVolume() {
        return totalGastricApirateVolume;
    }

    public void setTotalGastricApirateVolume(BigInteger totalGastricApirateVolume) {
        this.totalGastricApirateVolume = totalGastricApirateVolume;
    }

    public Date getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(Date reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getReviewDietician() {
        return reviewDietician;
    }

    public void setReviewDietician(String reviewDietician) {
        this.reviewDietician = reviewDietician;
    }

    public Double getOralEnergyReceived() {
        return oralEnergyReceived;
    }

    public void setOralEnergyReceived(Double oralEnergyReceived) {
        this.oralEnergyReceived = oralEnergyReceived;
    }

    public Boolean getApCerner() {
        return apCerner;
    }

    public void setApCerner(Boolean apCerner) {
        this.apCerner = apCerner;
    }

    public Boolean getFineBore() {
        return fineBore;
    }

    public void setFineBore(Boolean fineBore) {
        this.fineBore = fineBore;
    }

    public Boolean getPkNone() {
        return pkNone;
    }

    public void setPkNone(Boolean pkNone) {
        this.pkNone = pkNone;
    }

    public Boolean getPkNotGiven() {
        return pkNotGiven;
    }

    public void setPkNotGiven(Boolean pkNotGiven) {
        this.pkNotGiven = pkNotGiven;
    }

    public Boolean getApNotGiven() {
        return apNotGiven;
    }

    public void setApNotGiven(Boolean apNotGiven) {
        this.apNotGiven = apNotGiven;
    }

    public Boolean getFlexiseal() {
        return flexiseal;
    }

    public void setFlexiseal(Boolean flexiseal) {
        this.flexiseal = flexiseal;
    }

    public BigInteger getFlexisealVolume() {
        return flexisealVolume;
    }

    public void setFlexisealVolume(BigInteger flexisealVolume) {
        this.flexisealVolume = flexisealVolume;
    }

    public BigInteger getVomitVolume() {
        return vomitVolume;
    }

    public void setVomitVolume(BigInteger vomitVolume) {
        this.vomitVolume = vomitVolume;
    }

    public Boolean getVomit() {
        return vomit;
    }

    public void setVomit(Boolean vomit) {
        this.vomit = vomit;
    }

    public long getPropofol() {
        return propofol;
    }

    public void setPropofol(long propofol) {
        this.propofol = propofol;
    }

    public Assesmentandplan getAssesmentandplan() {
        return assesmentandplan;
    }

    public void setAssesmentandplan(Assesmentandplan assesmentandplan) {
        this.assesmentandplan = assesmentandplan;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (reviewPK != null ? reviewPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Review)) {
            return false;
        }
        Review other = (Review) object;
        if ((this.reviewPK == null && other.reviewPK != null) || (this.reviewPK != null && !this.reviewPK.equals(other.reviewPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "au.org.alfred.icu.nutrition.webservices.restful.Review[ reviewPK=" + reviewPK + " ]";
    }
    
}
